/*
  fast tracker 2 module player for web audio api      
  (c) 2012-2015 firehawk/tda  (firehawk@haxor.fi)

  todo:
  - this code is VERY incomplete, needs a lot of work
  - fix mixing so that the output volume is at a sensible level
  - add interpolation and volume ramping (copy from S3M player)
  - enable pan envelopes
  - implement missing volume column effect commands
  - implement missing ft2 commands G-Z
  - implement instrument vibrato
  - fix vibrato to check linear/amiga periods
  - weird channel volume bugs (f.ex. instrument "Calliope.pat" in funkystars.xm)
  - compatibility for versions older than 104h?
  - too many other bugs to list

  reading material:
  - ftp://ftp.modland.com/pub/documents/format_documentation/FastTracker%202%20v2.04%20(.xm).html
  - http://sid.ethz.ch/debian/milkytracker/milkytracker-0.90.85%2Bdfsg/resources/reference/xm-form.txt
  - ftp://ftp.modland.com/pub/documents/format_documentation/Tracker%20differences%20for%20Coders.txt
  - http://wiki.openmpt.org/Manual:_Compatible_Playback

  greets to guru, alfred and ccr for their work figuring out the .xm format. :)

*/

// helper functions for picking up signed, unsigned, little endian, etc from an unsigned 8-bit buffer
function le_word(buffer, offset) { return buffer[offset]|(buffer[offset+1]<<8); }
function le_dword(buffer, offset) { return buffer[offset]|(buffer[offset+1]<<8)|(buffer[offset+2]<<16)|(buffer[offset+3]<<24); }
function s_byte(buffer, offset) { return (buffer[offset]<128)?buffer[offset]:(buffer[offset]-256); }
function s_le_word(buffer, offset) { return (le_word(buffer,offset)<32768)?le_word(buffer,offset):(le_word(buffer,offset)-65536); }

function Fasttracker()
{
  var i, t;

  this.clearsong();
  this.initialize();

  this.playing=false;
  this.paused=false;
  this.repeat=false;

  this.separation=0;
  this.filter=false;

  this.syncqueue=[];

  this.samplerate=44100;
  this.ramplen=64.0;

  this.mixval=20.0; // todo: change according to channel count

  // amiga period value table
  this.periodtable=new Float32Array([
  //ft -8     -7     -6     -5     -4     -3     -2     -1
  //    0      1      2      3      4      5      6      7
      907.0, 900.0, 894.0, 887.0, 881.0, 875.0, 868.0, 862.0,  // B-3
      856.0, 850.0, 844.0, 838.0, 832.0, 826.0, 820.0, 814.0,  // C-4
      808.0, 802.0, 796.0, 791.0, 785.0, 779.0, 774.0, 768.0,  // C#4
      762.0, 757.0, 752.0, 746.0, 741.0, 736.0, 730.0, 725.0,  // D-4
      720.0, 715.0, 709.0, 704.0, 699.0, 694.0, 689.0, 684.0,  // D#4
      678.0, 675.0, 670.0, 665.0, 660.0, 655.0, 651.0, 646.0,  // E-4
      640.0, 636.0, 632.0, 628.0, 623.0, 619.0, 614.0, 610.0,  // F-4
      604.0, 601.0, 597.0, 592.0, 588.0, 584.0, 580.0, 575.0,  // F#4
      570.0, 567.0, 563.0, 559.0, 555.0, 551.0, 547.0, 543.0,  // G-4
      538.0, 535.0, 532.0, 528.0, 524.0, 520.0, 516.0, 513.0,  // G#4
      508.0, 505.0, 502.0, 498.0, 494.0, 491.0, 487.0, 484.0,  // A-4
      480.0, 477.0, 474.0, 470.0, 467.0, 463.0, 460.0, 457.0,  // A#4
      453.0, 450.0, 447.0, 445.0, 442.0, 439.0, 436.0, 433.0   // B-4
  ]);

  this.pan_r=new Float32Array(32);
  this.pan_l=new Float32Array(32);
  for(i=0;i<32;i++) { this.pan_r[i]=0.5; this.pan_l[i]=0.5; }

  // calc tables for vibrato waveforms
  this.vibratotable=new Array(
            0, 24, 49, 74, 97,120,141,161,180,197,212,224,235,244,250,253,
          255,253,250,244,235,224,212,197,180,161,141,120, 97, 74, 49, 24);
  // for(t=0;t<4;t++) {
    // this.vibratotable[t]=new Float32Array(64);
    // for(i=0;i<64;i++) {
      // switch(t) {
        // case 0:
          // this.vibratotable[t][i]=127*Math.sin(Math.PI*2*(i/64));
          // break;
        // case 1:
          // this.vibratotable[t][i]=127-4*i;
          // break;
        // case 2:
          // this.vibratotable[t][i]=(i<32)?127:-127;
          // break;
        // case 3:
          // this.vibratotable[t][i]=(1-2*Math.random())*127;
          // break;
      // }
    // }
  // }

  // volume column effect jumptable for 0x50..0xef
  this.voleffects_t0 = new Array(
    this.effect_vol_t0_f0,
    this.effect_vol_t0_60, this.effect_vol_t0_70, this.effect_vol_t0_80, this.effect_vol_t0_90, this.effect_vol_t0_a0,
    this.effect_vol_t0_b0, this.effect_vol_t0_c0, this.effect_vol_t0_d0, this.effect_vol_t0_e0
  );
  this.voleffects_t1 = new Array(
    this.effect_vol_t1_f0,
    this.effect_vol_t1_60, this.effect_vol_t1_70, this.effect_vol_t1_80, this.effect_vol_t1_90, this.effect_vol_t1_a0,
    this.effect_vol_t1_b0, this.effect_vol_t1_c0, this.effect_vol_t1_d0, this.effect_vol_t1_e0
  );

  // effect jumptables for tick 0 and ticks 1..f
  this.effects_t0 = new Array(
    this.effect_t0_0, this.effect_t0_1, this.effect_t0_2, this.effect_t0_3, this.effect_t0_4, this.effect_t0_5, this.effect_t0_6, this.effect_t0_7,
    this.effect_t0_8, this.effect_t0_9, this.effect_t0_a, this.effect_t0_b, this.effect_t0_c, this.effect_t0_d, this.effect_t0_e, this.effect_t0_f,
    this.effect_t0_g, this.effect_t0_h, this.effect_t0_i, this.effect_t0_j, this.effect_t0_k, this.effect_t0_l, this.effect_t0_m, this.effect_t0_n,
    this.effect_t0_o, this.effect_t0_p, this.effect_t0_q, this.effect_t0_r, this.effect_t0_s, this.effect_t0_t, this.effect_t0_u, this.effect_t0_v,
    this.effect_t0_w, this.effect_t0_x, this.effect_t0_y, this.effect_t0_z
  );
  this.effects_t0_e = new Array(
    this.effect_t0_e0, this.effect_t0_e1, this.effect_t0_e2, this.effect_t0_e3, this.effect_t0_e4, this.effect_t0_e5, this.effect_t0_e6, this.effect_t0_e7,
    this.effect_t0_e8, this.effect_t0_e9, this.effect_t0_ea, this.effect_t0_eb, this.effect_t0_ec, this.effect_t0_ed, this.effect_t0_ee, this.effect_t0_ef
  );
  this.effects_t1 = new Array(
    this.effect_t1_0, this.effect_t1_1, this.effect_t1_2, this.effect_t1_3, this.effect_t1_4, this.effect_t1_5, this.effect_t1_6, this.effect_t1_7,
    this.effect_t1_8, this.effect_t1_9, this.effect_t1_a, this.effect_t1_b, this.effect_t1_c, this.effect_t1_d, this.effect_t1_e, this.effect_t1_f,
    this.effect_t1_g, this.effect_t1_h, this.effect_t1_i, this.effect_t1_j, this.effect_t1_k, this.effect_t1_l, this.effect_t1_m, this.effect_t1_n,
    this.effect_t1_o, this.effect_t1_p, this.effect_t1_q, this.effect_t1_r, this.effect_t1_s, this.effect_t1_t, this.effect_t1_u, this.effect_t1_v,
    this.effect_t1_w, this.effect_t1_x, this.effect_t1_y, this.effect_t1_z
  );
  this.effects_t1_e = new Array(
    this.effect_t1_e0, this.effect_t1_e1, this.effect_t1_e2, this.effect_t1_e3, this.effect_t1_e4, this.effect_t1_e5, this.effect_t1_e6, this.effect_t1_e7,
    this.effect_t1_e8, this.effect_t1_e9, this.effect_t1_ea, this.effect_t1_eb, this.effect_t1_ec, this.effect_t1_ed, this.effect_t1_ee, this.effect_t1_ef
  );
}



// clear song data
Fasttracker.prototype.clearsong = function()
{  
  var i;

  this.title="";
  this.signature="";
  this.trackerversion=0x0104;

  this.songlen=1;
  this.repeatpos=0;

  this.channels=0;
  this.patterns=0;
  this.instruments=32;

  this.amigaperiods=0;

  this.initSpeed=6;
  this.initBPM=125;

  this.patterntable=new ArrayBuffer(256);
  for(i=0;i<256;i++) this.patterntable[i]=0;
  
  this.pattern=new Array();
  this.instrument=new Array(this.instruments);
  for(i=0;i<32;i++) {
    this.instrument[i]=new Object();
    this.instrument[i].name="";
    this.instrument[i].samples=new Array();
  }
}


// initialize all player variables to defaults prior to starting playback
Fasttracker.prototype.initialize = function()
{
  this.syncqueue=[];

  this.tick=0;
  this.position=0;
  this.row=0;
  this.offset=0;
  this.flags=0;

  this.volume=64;
  if (this.initSpeed) this.speed=this.initSpeed;
  if (this.initBPM) this.bpm=this.initBPM;
  this.breakrow=0;
  this.patternjump=0;
  this.patterndelay=0;
  this.patternwait=0;
  this.endofsong=false;
  this.looprow=0;
  this.loopstart=0;
  this.loopcount=0;
  
  this.channel=new Array();
  for(i=0;i<this.channels;i++) {
    this.channel[i]=new Object();

    this.channel[i].instrument=0;
    this.channel[i].sampleindex=0;

    this.channel[i].note=36;
    this.channel[i].command=0;
    this.channel[i].data=0;
    this.channel[i].samplepos=0;
    this.channel[i].samplespeed=0;
    this.channel[i].flags=0;
    this.channel[i].noteon=0;

    this.channel[i].slidespeed=0;
    this.channel[i].slideto=0;
    this.channel[i].slidetospeed=0;
    this.channel[i].arpeggio=0;

    this.channel[i].period=640;
    this.channel[i].frequency=8363;
    
    this.channel[i].volume=64;
    this.channel[i].voiceperiod=0;
    this.channel[i].voicevolume=0;

    this.channel[i].semitone=12;
    this.channel[i].vibratospeed=0
    this.channel[i].vibratodepth=0
    this.channel[i].vibratopos=0;
    this.channel[i].vibratowave=0;
    
    this.channel[i].volramp=1.0;
    this.channel[i].volrampfrom=0;
    
    this.channel[i].volenvpos=0;
    this.channel[i].panenvpos=0;
    this.channel[i].fadeoutpos=0;
    
    this.channel[i].playdir=1;
  }
}



// parse the module from local buffer
Fasttracker.prototype.parse = function(buffer)
{
  var i, j, k, c, offset, datalen, hdrlen;
  
  if (!buffer) return false;

  // check xm signature, type and tracker version
  for(i=0;i<17;i++) this.signature+=String.fromCharCode(buffer[i]);
  if (this.signature != "Extended Module: ") return false;
  if (buffer[37] != 0x1a) return false;
  this.signature="X.M.";
  this.trackerversion=le_word(buffer, 58);
  if (this.trackerversion < 0x0104) return false; // older versions not currently supported

  // song title
  i=0;
  while(buffer[i] && i<20) this.title+=String.fromCharCode(buffer[17+i++]);

  offset=60;
  hdrlen=le_dword(buffer, offset);
  this.songlen=le_word(buffer, offset+4);
  this.repeatpos=le_word(buffer, offset+6);
  this.channels=le_word(buffer, offset+8);
  this.patterns=le_word(buffer, offset+10);
  this.instruments=le_word(buffer, offset+12);

  this.amigaperiods=le_word(buffer, offset+14)&1;

  this.initSpeed=le_word(buffer, offset+16);
  this.initBPM=le_word(buffer, offset+18);

  var maxpatt=0;
  for(i=0;i<256;i++) {
    this.patterntable[i]=buffer[offset+20+i];
    if (this.patterntable[i]>maxpatt) maxpatt=this.patterntable[i];
  }
  maxpatt++;
  
  // allocate pattern data and initialize them all
  this.pattern=new Array(maxpatt); //this.patterns);
  this.patternlen=new Array(maxpatt); //this.patterns);
  for(i=0;i<maxpatt;i++) {
    // initialize the pattern to defaults prior to unpacking
    this.patternlen[i]=64;
    this.pattern[i]=new Uint8Array(this.channels*this.patternlen[i]*5);
    for(row=0;row<this.patternlen[i];row++) for(ch=0;ch<this.channels;ch++) {
      this.pattern[i][row*this.channels*5 + ch*5 + 0]=255; // note (255=no note)
      this.pattern[i][row*this.channels*5 + ch*5 + 1]=0; // instrument
      this.pattern[i][row*this.channels*5 + ch*5 + 2]=255 // volume
      this.pattern[i][row*this.channels*5 + ch*5 + 3]=0; // command
      this.pattern[i][row*this.channels*5 + ch*5 + 4]=0; // parameter
    }
  }

  // load and unpack patterns
  offset+=hdrlen; // initial offset for patterns
  i=0;
  while(i<this.patterns) {
    this.patternlen[i]=le_word(buffer, offset+5);
    this.pattern[i]=new Uint8Array(this.channels*this.patternlen[i]*5);
    datalen=le_word(buffer, offset+7);
    offset+=le_dword(buffer, offset); // jump over header
    j=0; k=0;
    while(j<datalen) {
      c=buffer[offset+j++];
      if (c&128) {
        // first byte is a bitmask
        if (c&1) this.pattern[i][k+0]=buffer[offset+j++];
        if (c&2) this.pattern[i][k+1]=buffer[offset+j++];
        if (c&4) this.pattern[i][k+2]=buffer[offset+j++];
        if (c&8) this.pattern[i][k+3]=buffer[offset+j++];
        if (c&16) this.pattern[i][k+4]=buffer[offset+j++];
      } else {
        // first byte is note -> all columns present sequentially
        this.pattern[i][k+0]=(c==97)?254:c;
        this.pattern[i][k+1]=buffer[offset+j++];
        this.pattern[i][k+2]=buffer[offset+j++];
        this.pattern[i][k+3]=buffer[offset+j++];
        this.pattern[i][k+4]=buffer[offset+j++];
      }
      // remap note to st3-style, 255=no note, 254=note off
      this.pattern[i][k+0]=(this.pattern[i][k+0]==97)?254:this.pattern[i][k+0];
      this.pattern[i][k+0]=(this.pattern[i][k+0]==0)?255:this.pattern[i][k+0];
      // remap volume column setvol to 0x00..0x40, tone porta to 0x50..0x5f and 0xff for nop
      if (this.pattern[i][k+2]<0x10) this.pattern[i][k+2]=255;
      if (this.pattern[i][k+2]>=0x10 && this.pattern[i][k+2]<=0x50) this.pattern[i][k+2]-=0x10;
      if (this.pattern[i][k+2]>=0xf0) this.pattern[i][k+2]-=0xa0;
      k+=5;      
    }
    offset+=j;
    i++;
  }
  this.patterns=maxpatt;
  
  // instruments
  this.instrument=new Array(this.instruments);    
  i=0;
  while(i<this.instruments) {
    hdrlen=le_dword(buffer, offset);
    this.instrument[i]=new Object();
    this.instrument[i].sample=new Array();
    this.instrument[i].name="";
    j=0;
    while(buffer[offset+4+j] && j<22)
      this.instrument[i].name+=String.fromCharCode(buffer[offset+4+j++]);
    this.instrument[i].samples=le_word(buffer, offset+27);

    // initialize to defaults
    this.instrument[i].samplemap=new Uint8Array(96);
    for(j=0;j<96;j++) this.instrument[i].samplemap[j]=0;
    
    if (this.instrument[i].samples) {
      var smphdrlen=le_dword(buffer, offset+29);

      for(j=0;j<96;j++) this.instrument[i].samplemap[j]=buffer[offset+33+j];

      // envelopes. the xm specs say 48 bytes per envelope, but while that may
      // technically be correct, what they don't say is that it means 12 pairs of
      // little endian words. first word is the x coordinate, second is y. point
      // 0 always has x=0.
      var tmp_volenv=new Array(12);
      var tmp_panenv=new Array(12);
      for(j=0;j<12;j++) {
        tmp_volenv[j]=new Uint16Array([le_word(buffer, offset+129+j*4), le_word(buffer, offset+129+j*4+2)]);
        tmp_panenv[j]=new Uint16Array([le_word(buffer, offset+177+j*4), le_word(buffer, offset+177+j*4+2)]);
      }
      
      // pre-interpolate the envelopes to arrays of [0..1] float32 values which
      // are stepped through at a rate of one per tick. max tick count is 0x0144.
      this.instrument[i].volenv=new Float32Array(325);
      this.instrument[i].panenv=new Float32Array(325);
      for(j=0;j<325;j++) {
        var p, delta;
        
        p=0;
        while(tmp_volenv[p][0]<=j && p<11) p++;
        delta=(tmp_volenv[p][1]-tmp_volenv[p-1][1]) / (tmp_volenv[p][0]-tmp_volenv[p-1][0]);
        this.instrument[i].volenv[j]=(tmp_volenv[p-1][1] + delta*(j-tmp_volenv[p-1][0]))/64.0;

        p=0;
        while(tmp_panenv[p][0]<=j && p<11) p++;
        delta=(tmp_panenv[p][1]-tmp_panenv[p-1][1]) / (tmp_panenv[p][0]-tmp_panenv[p-1][0]);
        this.instrument[i].panenv[j]=(tmp_panenv[p-1][1] + delta*(j-tmp_panenv[p-1][0]))/64.0;
      }
      
      // volume envelope parameters
      this.instrument[i].volenvlen=tmp_volenv[Math.max(0, buffer[offset+225]-1)][0];
      this.instrument[i].volsustain=tmp_volenv[buffer[offset+227]][0];
      this.instrument[i].volloopstart=tmp_volenv[buffer[offset+228]][0];
      this.instrument[i].volloopend=tmp_volenv[buffer[offset+229]][0];
      this.instrument[i].voltype=buffer[offset+233]; // 1=enabled, 2=sustain, 4=loop

      // pan envelope parameters
      this.instrument[i].panenvlen=tmp_panenv[Math.max(0, buffer[offset+226]-1)][0];
      this.instrument[i].pansustain=tmp_panenv[buffer[offset+230]][0];
      this.instrument[i].panloopstart=tmp_panenv[buffer[offset+231]][0];
      this.instrument[i].panloopend=tmp_panenv[buffer[offset+232]][0];
      this.instrument[i].pantype=buffer[offset+234];
      
      // vibrato
      this.instrument[i].vibratotype=buffer[offset+235];
      this.instrument[i].vibratosweep=buffer[offset+236];
      this.instrument[i].vibratodepth=buffer[offset+237];
      this.instrument[i].vibratorate=buffer[offset+238];

      // volume fade out
      this.instrument[i].volfadeout=le_word(buffer, offset+239);
      
      // sample headers
      offset+=hdrlen;
      this.instrument[i].sample=new Array(this.instrument[i].samples);
      for(j=0;j<this.instrument[i].samples;j++) {
        datalen=le_dword(buffer, offset+0);
         
        this.instrument[i].sample[j]=new Object();
        this.instrument[i].sample[j].bits=(buffer[offset+14]&16)?16:8;
        this.instrument[i].sample[j].stereo=0;
        this.instrument[i].sample[j].bps=(this.instrument[i].sample[j].bits==16)?2:1; // bytes per sample

        // sample length and loop points are in BYTES even for 16-bit samples!
        this.instrument[i].sample[j].length=datalen / this.instrument[i].sample[j].bps;
        this.instrument[i].sample[j].loopstart=le_dword(buffer, offset+4) / this.instrument[i].sample[j].bps;
        this.instrument[i].sample[j].looplength=le_dword(buffer, offset+8) / this.instrument[i].sample[j].bps;
        this.instrument[i].sample[j].loopend=this.instrument[i].sample[j].loopstart+this.instrument[i].sample[j].looplength;
        this.instrument[i].sample[j].looptype=buffer[offset+14]&0x03;        
        
        this.instrument[i].sample[j].volume=buffer[offset+12];

        // finetune and seminote tuning
        if (buffer[offset+13]<128) {
          this.instrument[i].sample[j].finetune=buffer[offset+13];
        } else {
          this.instrument[i].sample[j].finetune=buffer[offset+13]-256;        
        }
        if (buffer[offset+16]<128) {
          this.instrument[i].sample[j].relativenote=buffer[offset+16];
        } else {
          this.instrument[i].sample[j].relativenote=buffer[offset+16]-256;
        }

        this.instrument[i].sample[j].panning=buffer[offset+15];

        k=0; this.instrument[i].sample[j].name="";
        while(buffer[offset+18+k] && k<22) this.instrument[i].sample[j].name+=String.fromCharCode(buffer[offset+18+k++]);
        
        offset+=smphdrlen;
      }
      
      // sample data (convert to signed float32)
      for(j=0;j<this.instrument[i].samples;j++) {
        this.instrument[i].sample[j].data=new Float32Array(this.instrument[i].sample[j].length);
        c=0;
        if (this.instrument[i].sample[j].bits==16) {
          for(k=0;k<this.instrument[i].sample[j].length;k++) {
            c+=s_le_word(buffer, offset+k*2);
            if (c<-32768) c+=65536;
            if (c>32767) c-=65536;
            this.instrument[i].sample[j].data[k]=c/32768.0;            
          }        
        } else {
          for(k=0;k<this.instrument[i].sample[j].length;k++) {
            c+=s_byte(buffer, offset+k);
            if (c<-128) c+=256;
            if (c>127) c-=256;
            this.instrument[i].sample[j].data[k]=c/128.0;
          }          
        }
        offset+=this.instrument[i].sample[j].length * this.instrument[i].sample[j].bps; //datalen;
      }
    } else {
      offset+=hdrlen;
    }
    i++;
  }

  this.ready=true;
  this.loading=false;

  this.mixval=this.channels;

  this.chvu=new Float32Array(this.channels);
  for(i=0;i<this.channels;i++) this.chvu[i]=0.0;

  return true;
}



// calculate period value for note
Fasttracker.prototype.calcperiod=function(mod, note, finetune) {
  var pv;
  note-=1;
  if (mod.amigaperiods) {
    // amiga periods
    var ft=Math.floor(finetune/16.0);
    var p1=mod.periodtable[ 8 + ((note%12)  )*8 + ft ]; //Math.floor(ft/16.0) ];
    var p2=mod.periodtable[ 8 + ((note%12)+1)*8 + ft ]; //Math.floor(ft/16.0) ];
    ft=(finetune/16.0) - ft; //Math.floor(ft/16.0);
    pv=((1.0-ft)*p1 + ft*p2)*( 16.0/Math.pow(2, Math.floor(note/12)-1) ); // todo: why does octave need -1 to sound correct?
  } else {
    // linear
    pv=10*12*16*4 - note*16*4 - finetune/2;
  }
  return pv;
}



// advance player
Fasttracker.prototype.advance=function(mod) {
  var spd=(((mod.samplerate*60)/mod.bpm)/4)/6;

  // advance player
  if (mod.offset>spd) {
    mod.tick++; mod.offset=0; mod.flags|=1;

    // step all running envelopes once per tick
    for(var ch=0;ch<mod.channels;ch++) {
      var i=mod.channel[ch].instrument;

      // volume envelope, if enabled (also fadeout)
      if (mod.instrument[i].voltype&1) {
        mod.channel[ch].volenvpos++;      

        if (mod.channel[ch].noteon &&
            (mod.instrument[i].voltype&2) &&
            mod.channel[ch].volenvpos > mod.instrument[i].volsustain)
          mod.channel[ch].volenvpos=mod.instrument[i].volsustain;

        if ((mod.instrument[i].voltype&4) &&
            mod.channel[ch].volenvpos > mod.instrument[i].volloopend)
          mod.channel[ch].volenvpos=mod.instrument[i].volloopstart;

        if (mod.channel[ch].volenvpos > mod.instrument[i].volenvlen)
          mod.channel[ch].volenvpos=mod.instrument[i].volenvlen;

        if (mod.channel[ch].volenvpos>324) mod.channel[ch].volenvpos=324;

        // fadeout if note is off
        if (!mod.channel[ch].noteon && mod.channel[ch].fadeoutpos) {
          mod.channel[ch].fadeoutpos-=mod.instrument[i].volfadeout;
          if (mod.channel[ch].fadeoutpos<0) mod.channel[ch].fadeoutpos=0;
        }
      }

      // pan envelope, if enabled
      if (mod.instrument[i].pantype&1) {
        mod.channel[ch].panenvpos++;      

        if (mod.channel[ch].noteon &&
            mod.instrument[i].pantype&2 &&
            mod.channel[ch].panenvpos > mod.instrument[i].pansustain)
          mod.channel[ch].panenvpos=mod.instrument[i].pansustain;

        if (mod.instrument[i].pantype&4 &&
            mod.channel[ch].panenvpos > mod.instrument[i].panloopend)
          mod.channel[ch].panenvpos=mod.instrument[i].panloopstart;

        if (mod.channel[ch].panenvpos > mod.instrument[i].panenvlen)
          mod.channel[ch].panenvpos=mod.instrument[i].panenvlen;

        if (mod.channel[ch].panenvpos>324) mod.channel[ch].panenvpos=324;
      }
    }
  }
  
  if (mod.tick>=mod.speed) {
    if (mod.patterndelay) { // delay pattern
      if (mod.tick < ((mod.patternwait+1)*mod.speed)) {
        mod.patternwait++;
      } else {
        mod.row++; mod.tick=0; mod.flags|=2; mod.patterndelay=0;
      }
    }
    else {
      if (mod.flags&(16+32+64)) {
        if (mod.flags&64) { // loop pattern?
          mod.row=mod.looprow;
          mod.flags&=0xa1;
          mod.flags|=2;
        }
        else {
          if (mod.flags&16) { // pattern jump/break?
            mod.position=mod.patternjump;
            mod.row=mod.breakrow;
            mod.patternjump=0;
            mod.breakrow=0;
            mod.flags&=0xe1;
            mod.flags|=2;
          }
        }
        mod.tick=0;
      } else {
        mod.row++; mod.tick=0; mod.flags|=2;
      }
    }
  }
  if (mod.row>=64) {
    mod.position++;
    mod.row=0;
    mod.flags|=4;
  }
  if (mod.position>=mod.songlen) {
    if (mod.repeat) {
      mod.position=0;
    } else {
      this.endofsong=true;
    }
    return;
  }
}



// process one channel on a row in pattern p, pp is an offset to pattern data
Fasttracker.prototype.process_note = function(mod, p, ch) {
  var n, i, s, v, pp, pv;

  pp=mod.row*5*mod.channels + ch*5;
  
  n=mod.pattern[p][pp];
  i=mod.pattern[p][pp+1];
  if (i && i<=mod.instrument.length) {
    mod.channel[ch].instrument=i-1;
    
    if (mod.instrument[i-1].samples) {
      s=mod.instrument[i-1].samplemap[mod.channel[ch].note-1];
      mod.channel[ch].sampleindex=s;
      mod.channel[ch].volume=mod.instrument[i-1].sample[s].volume;
    } else {
      mod.channel[ch].sampleindex=0;
      mod.channel[ch].volume=64;
    } 
    mod.channel[ch].voicevolume=mod.channel[ch].volume;
  }
  i=mod.channel[ch].instrument;

  if (n && n<97) {
    // look up the sample
    s=mod.instrument[i].samplemap[n-1];
    mod.channel[ch].sampleindex=s;

    var rn=n + mod.instrument[i].sample[s].relativenote;
  
    // calc period for note
    pv=mod.calcperiod(mod, rn, mod.instrument[i].sample[s].finetune);

    // noteon, except if command=0x03 (porta to note) or 0x05 (porta+volslide)
    if ((mod.channel[ch].command != 0x03) && (mod.channel[ch].command != 0x05)) {
      mod.channel[ch].note=n;
      mod.channel[ch].period=pv;
      mod.channel[ch].voiceperiod=mod.channel[ch].period;
      mod.channel[ch].samplepos=0;
      mod.channel[ch].playdir=1;      
      if (mod.channel[ch].vibratowave>3) mod.channel[ch].vibratopos=0;
      
      mod.channel[ch].flags|=3; // force sample speed recalc
      mod.channel[ch].noteon=1;      

      mod.channel[ch].fadeoutpos=65535;
      mod.channel[ch].volenvpos=0;
      mod.channel[ch].panenvpos=0;
    }
    // in either case, set the slide to note target to note period
    mod.channel[ch].slideto=pv;
  } else if (n==254) {
    mod.channel[ch].noteon=0; // note off
  }
  
  if (mod.pattern[p][pp+2]!=255) {
    v=mod.pattern[p][pp+2];
    if (v<=0x40) {
      mod.channel[ch].volume=v;
      mod.channel[ch].voicevolume=mod.channel[ch].volume;              
    }
  }
}



// mix an audio buffer with data
Fasttracker.prototype.mix = function(ape, mod) {
  var f, fs, fl, fr, pv;
  var p, pp, n, nn;
  var i, si;

  outp=new Float32Array(2);

  var bufs=new Array(ape.outputBuffer.getChannelData(0), ape.outputBuffer.getChannelData(1));
  var buflen=ape.outputBuffer.length;
  for(var s=0;s<buflen;s++)
  {
    outp[0]=0.0;
    outp[1]=0.0;
    if (!mod.paused && !mod.endofsong && mod.playing)
    {
      mod.advance(mod);
      for(var ch=0;ch<mod.channels;ch++)
      {
        mod.chvu[ch]=0.0;
      
        // calculate playback position
        p=mod.patterntable[mod.position];
        pp=mod.row*5*mod.channels + ch*5;

        if (mod.flags&2) { // new row
          mod.channel[ch].command=mod.pattern[p][pp+3];
          mod.channel[ch].data=mod.pattern[p][pp+4];
          if (!(mod.channel[ch].command==0x0e && (mod.channel[ch].data&0xf0)==0xd0)) { // note delay?
            mod.process_note(mod, p, ch);            
          }
        }
        i=mod.channel[ch].instrument;
        si=mod.channel[ch].sampleindex;

        // kill empty instruments
        if (mod.channel[ch].noteon && !mod.instrument[i].samples) {
          mod.channel[ch].noteon=0;
        }
        
        // effects
        if (mod.flags&1) {
          var v=mod.pattern[p][pp+2];
          if (v>=0x50 && v<0xf0) {
            if (!mod.tick) mod.voleffects_t0[(v>>4)-5](mod, ch, v&0x0f);
             else mod.voleffects_t1[(v>>4)-5](mod, ch, v&0x0f);        
          }
          if (mod.channel[ch].command < 36) {
            if (!mod.tick) {
              // process only on tick 0
              mod.effects_t0[mod.channel[ch].command](mod, ch);
            } else {
              mod.effects_t1[mod.channel[ch].command](mod, ch);    
            }
          }
        }

        // recalc sample speed if voiceperiod has changed
        if ((mod.channel[ch].flags&1 || mod.flags&2) && mod.channel[ch].voiceperiod)
        {
          var f;
          if (mod.amigaperiods) {
            f=8363.0 * 1712.0/mod.channel[ch].voiceperiod;
          } else {
            f=8363.0 * Math.pow(2.0, (6*12*16*4 - mod.channel[ch].voiceperiod) / (12*16*4));
          }
          mod.channel[ch].samplespeed=f/mod.samplerate;
        }
        
        // advance vibrato on each new tick
        if (mod.flags&1) {
          mod.channel[ch].vibratopos+=mod.channel[ch].vibratospeed;
          mod.channel[ch].vibratopos&=0x3f;
        }

        // add channel output to left/right master outputs
        fl=0.0; fr=0.0;
        if (mod.channel[ch].noteon || 
            ((mod.instrument[i].voltype&1) && !mod.channel[ch].noteon && mod.channel[ch].fadeoutpos)
           ) {
          if (mod.instrument[i].sample[si].length > mod.channel[ch].samplepos) {
            fs=mod.instrument[i].sample[si].data[Math.floor(mod.channel[ch].samplepos)];

            pv=mod.channel[ch].voicevolume/64.0;
            if (mod.instrument[i].voltype&1) {
              pv*=mod.instrument[i].volenv[mod.channel[ch].volenvpos];
              if (!mod.channel[ch].noteon && mod.channel[ch].fadeoutpos) pv*=mod.channel[ch].fadeoutpos/65536.0;
            }
            fs*=pv;

            // todo: interpolation and volume ramps

            // pan samples (todo: pan envelope)
            fr=fs*mod.pan_r[ch];
            fl=fs*mod.pan_l[ch];
          }
          outp[0]+=fl;
          outp[1]+=fr;

          // advance sample position and check for loop or end
          mod.channel[ch].samplepos+=mod.channel[ch].playdir*mod.channel[ch].samplespeed;
          if (mod.instrument[i].sample[si].looptype) {
            if (mod.instrument[i].sample[si].looptype==2) {
              // pingpong loop
              if (mod.channel[ch].playdir==-1) {
                // bounce off from start?
                if (mod.channel[ch].samplepos <= mod.instrument[i].sample[si].loopstart) {
                  mod.channel[ch].samplepos=mod.instrument[i].sample[si].loopstart; //-mod.channel[ch].samplepos;
                  mod.channel[ch].playdir=1;
                }
              } else {
                // bounce off from end?
                if (mod.channel[ch].samplepos >= mod.instrument[i].sample[si].loopend) {
                  mod.channel[ch].samplepos=mod.instrument[i].sample[si].loopend;
                  mod.channel[ch].playdir=-1;
                }
              }
            } else {
              // normal loop
              if (mod.channel[ch].samplepos >= mod.instrument[i].sample[si].loopend) mod.channel[ch].samplepos-=mod.instrument[i].sample[si].looplength;
            }
          } else {
            if (mod.channel[ch].samplepos >= mod.instrument[i].sample[si].length) mod.channel[ch].noteon=0;
          }          
        }
        mod.chvu[ch]=Math.max(mod.chvu[ch], Math.abs(fl+fr));

        // clear channel flags
        mod.channel[ch].flags=0;
      }
      mod.offset++;
      mod.flags&=0x70;      
    }
    
    // a more headphone-friendly stereo separation
    if (mod.separation) {
      t=outp[0];
      if (mod.separation==2) { // mono
        outp[0]=outp[0]*0.5 + outp[1]*0.5;
        outp[1]=outp[1]*0.5 + t*0.5;
      } else {
        outp[0]=outp[0]*0.65 + outp[1]*0.35;
        outp[1]=outp[1]*0.65 + t*0.35;
      }
    }

    // scale down, soft clip and update left/right vu meters
    t=(mod.volume/64.0);
    outp[0]*=t; outp[0]/=mod.mixval; outp[0]=0.5*(Math.abs(outp[0]+0.975)-Math.abs(outp[0]-0.975));
    outp[1]*=t; outp[1]/=mod.mixval; outp[1]=0.5*(Math.abs(outp[1]+0.975)-Math.abs(outp[1]-0.975));

    // done - store to output buffer
    bufs[0][s]=outp[0];
    bufs[1][s]=outp[1];
  }
}





//
// volume column effect functions
//
Fasttracker.prototype.effect_vol_t0_60=function(mod, ch, data) { // 60-6f vol slide down
  // -
}
Fasttracker.prototype.effect_vol_t0_70=function(mod, ch, data) { // 70-7f vol slide up
  // -
}
Fasttracker.prototype.effect_vol_t0_80=function(mod, ch, data) { // 80-8f fine vol slide down
  mod.channel[ch].voicevolume-=data;
  if (mod.channel[ch].voicevolume<0) mod.channel[ch].voicevolume=0;
}
Fasttracker.prototype.effect_vol_t0_90=function(mod, ch, data) { // 90-9f fine vol slide up
  mod.channel[ch].voicevolume+=data;
  if (mod.channel[ch].voicevolume>64) mod.channel[ch].voicevolume=64;
}
Fasttracker.prototype.effect_vol_t0_a0=function(mod, ch, data) { // a0-af set vibrato speed
  mod.channel[ch].vibratospeed=data;
}
Fasttracker.prototype.effect_vol_t0_b0=function(mod, ch, data) { // b0-bf vibrato
  if (data) mod.channel[ch].vibratodepth=data;
  mod.effect_t1_4(mod, ch);
}
Fasttracker.prototype.effect_vol_t0_c0=function(mod, ch, data) { // c0-cf set panning
}
Fasttracker.prototype.effect_vol_t0_d0=function(mod, ch, data) { // d0-df panning slide left
}
Fasttracker.prototype.effect_vol_t0_e0=function(mod, ch, data) { // e0-ef panning slide right
}
Fasttracker.prototype.effect_vol_t0_f0=function(mod, ch, data) { // f0-ff tone porta
}
//////
Fasttracker.prototype.effect_vol_t1_60=function(mod, ch, data) { // 60-6f vol slide down
  mod.channel[ch].voicevolume-=data;
  if (mod.channel[ch].voicevolume<0) mod.channel[ch].voicevolume=0;
}
Fasttracker.prototype.effect_vol_t1_70=function(mod, ch, data) { // 70-7f vol slide up
  mod.channel[ch].voicevolume+=data;
  if (mod.channel[ch].voicevolume>64) mod.channel[ch].voicevolume=64;
}
Fasttracker.prototype.effect_vol_t1_80=function(mod, ch, data) { // 80-8f fine vol slide down
  // -
}
Fasttracker.prototype.effect_vol_t1_90=function(mod, ch, data) { // 90-9f fine vol slide up
  // -
}
Fasttracker.prototype.effect_vol_t1_a0=function(mod, ch, data) { // a0-af set vibrato speed
  // -
}
Fasttracker.prototype.effect_vol_t1_b0=function(mod, ch, data) { // b0-bf vibrato
  mod.effect_t1_4(mod, ch); // same as effect column vibrato on ticks 1+
}
Fasttracker.prototype.effect_vol_t1_c0=function(mod, ch, data) { // c0-cf set panning
}
Fasttracker.prototype.effect_vol_t1_d0=function(mod, ch, data) { // d0-df panning slide left
}
Fasttracker.prototype.effect_vol_t1_e0=function(mod, ch, data) { // e0-ef panning slide right
}
Fasttracker.prototype.effect_vol_t1_f0=function(mod, ch, data) { // f0-ff tone porta
}



//
// tick 0 effect functions
//
Fasttracker.prototype.effect_t0_0=function(mod, ch) { // 0 arpeggio
  mod.channel[ch].arpeggio=mod.channel[ch].data;
}
Fasttracker.prototype.effect_t0_1=function(mod, ch) { // 1 slide up
  if (mod.channel[ch].data) mod.channel[ch].slideupspeed=mod.channel[ch].data*16;
}
Fasttracker.prototype.effect_t0_2=function(mod, ch) { // 2 slide down
  if (mod.channel[ch].data) mod.channel[ch].slidedownspeed=mod.channel[ch].data*16;
}
Fasttracker.prototype.effect_t0_3=function(mod, ch) { // 3 slide to note
  if (mod.channel[ch].data) mod.channel[ch].slidetospeed=mod.channel[ch].data*16;
}
Fasttracker.prototype.effect_t0_4=function(mod, ch) { // 4 vibrato
  if (mod.channel[ch].data&0x0f && mod.channel[ch].data&0xf0) {
    mod.channel[ch].vibratodepth=(mod.channel[ch].data&0x0f);
    mod.channel[ch].vibratospeed=(mod.channel[ch].data&0xf0)>>4;
  }
  mod.effect_t1_4(mod, ch);
}
Fasttracker.prototype.effect_t0_5=function(mod, ch) { // 5
}
Fasttracker.prototype.effect_t0_6=function(mod, ch) { // 6
}
Fasttracker.prototype.effect_t0_7=function(mod, ch) { // 7
}
Fasttracker.prototype.effect_t0_8=function(mod, ch) { // 8 set panning
}
Fasttracker.prototype.effect_t0_9=function(mod, ch) { // 9 set sample offset
  mod.channel[ch].samplepos=mod.channel[ch].data*256;
  mod.channel[ch].playdir=1;      
}
Fasttracker.prototype.effect_t0_a=function(mod, ch) { // a
}
Fasttracker.prototype.effect_t0_b=function(mod, ch) { // b pattern jump
  mod.breakrow=0;
  mod.patternjump=mod.channel[ch].data;
  mod.flags|=16;
}
Fasttracker.prototype.effect_t0_c=function(mod, ch) { // c set volume
  mod.channel[ch].voicevolume=mod.channel[ch].data;
}
Fasttracker.prototype.effect_t0_d=function(mod, ch) { // d pattern break
  mod.breakrow=((mod.channel[ch].data&0xf0)>>4)*10 + (mod.channel[ch].data&0x0f);
  if (!(mod.flags&16)) mod.patternjump=mod.position+1;
  mod.flags|=16;  
}
Fasttracker.prototype.effect_t0_e=function(mod, ch) { // e
  var i=(mod.channel[ch].data&0xf0)>>4;
  mod.effects_t0_e[i](mod, ch);
}
Fasttracker.prototype.effect_t0_f=function(mod, ch) { // f set speed
  if (mod.channel[ch].data > 32) {
    mod.bpm=mod.channel[ch].data;
  } else {
    if (mod.channel[ch].data) mod.speed=mod.channel[ch].data;
  }
}
Fasttracker.prototype.effect_t0_g=function(mod, ch) { // g set global volume
//  if (mod.channel[ch].data<=0x40) mod.volume=mod.channel[ch].data;
}
Fasttracker.prototype.effect_t0_h=function(mod, ch) {} // h global volume slide
Fasttracker.prototype.effect_t0_i=function(mod, ch) {} // i
Fasttracker.prototype.effect_t0_j=function(mod, ch) {} // j
Fasttracker.prototype.effect_t0_k=function(mod, ch) {  // k key off
  mod.channel[ch].noteon=0;
}
Fasttracker.prototype.effect_t0_l=function(mod, ch) {  // l set envelope position
  mod.channel[ch].volenvpos=mod.channel[ch].data;
  mod.channel[ch].panenvpos=mod.channel[ch].data;
}
Fasttracker.prototype.effect_t0_m=function(mod, ch) {} // m
Fasttracker.prototype.effect_t0_n=function(mod, ch) {} // n
Fasttracker.prototype.effect_t0_o=function(mod, ch) {} // o
Fasttracker.prototype.effect_t0_p=function(mod, ch) {} // p panning slide
Fasttracker.prototype.effect_t0_q=function(mod, ch) {} // q
Fasttracker.prototype.effect_t0_r=function(mod, ch) {} // r multi retrig note
Fasttracker.prototype.effect_t0_s=function(mod, ch) {} // s
Fasttracker.prototype.effect_t0_t=function(mod, ch) {} // t tremor
Fasttracker.prototype.effect_t0_u=function(mod, ch) {} // u
Fasttracker.prototype.effect_t0_v=function(mod, ch) {} // v
Fasttracker.prototype.effect_t0_w=function(mod, ch) {} // w
Fasttracker.prototype.effect_t0_x=function(mod, ch) {} // x extra fine porta up/down
Fasttracker.prototype.effect_t0_y=function(mod, ch) {} // y
Fasttracker.prototype.effect_t0_z=function(mod, ch) {} // z


//
// tick 0 effect e functions
//
Fasttracker.prototype.effect_t0_e0=function(mod, ch) { // e0 filter on/off
}
Fasttracker.prototype.effect_t0_e1=function(mod, ch) { // e1 fine slide up
  mod.channel[ch].period-=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].period < 113) mod.channel[ch].period=113;
}
Fasttracker.prototype.effect_t0_e2=function(mod, ch) { // e2 fine slide down
  mod.channel[ch].period+=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].period > 856) mod.channel[ch].period=856;
  mod.channel[ch].flags|=1;
}
Fasttracker.prototype.effect_t0_e3=function(mod, ch) { // e3 set glissando
}
Fasttracker.prototype.effect_t0_e4=function(mod, ch) { // e4 set vibrato waveform
  mod.channel[ch].vibratowave=mod.channel[ch].data&0x07;
}
Fasttracker.prototype.effect_t0_e5=function(mod, ch) { // e5 set finetune
}
Fasttracker.prototype.effect_t0_e6=function(mod, ch) { // e6 loop pattern
  if (mod.channel[ch].data&0x0f) {
    if (mod.loopcount) {
      mod.loopcount--;
    } else {
      mod.loopcount=mod.channel[ch].data&0x0f;
    }
    if (mod.loopcount) mod.flags|=64;
  } else {
    mod.looprow=mod.row;
  }
}
Fasttracker.prototype.effect_t0_e7=function(mod, ch) { // e7
}
Fasttracker.prototype.effect_t0_e8=function(mod, ch) { // e8, use for syncing
  mod.syncqueue.unshift(mod.channel[ch].data&0x0f);
}
Fasttracker.prototype.effect_t0_e9=function(mod, ch) { // e9
}
Fasttracker.prototype.effect_t0_ea=function(mod, ch) { // ea fine volslide up
  mod.channel[ch].voicevolume+=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].voicevolume > 64) mod.channel[ch].voicevolume=64;
}
Fasttracker.prototype.effect_t0_eb=function(mod, ch) { // eb fine volslide down
  mod.channel[ch].voicevolume-=mod.channel[ch].data&0x0f;
  if (mod.channel[ch].voicevolume < 0) mod.channel[ch].voicevolume=0;
}
Fasttracker.prototype.effect_t0_ec=function(mod, ch) { // ec
}
Fasttracker.prototype.effect_t0_ed=function(mod, ch) { // ed delay sample
  if (mod.tick==(mod.channel[ch].data&0x0f)) {
    mod.process_note(mod, mod.patterntable[mod.position], ch);            
  }
}
Fasttracker.prototype.effect_t0_ee=function(mod, ch) { // ee delay pattern
  mod.patterndelay=mod.channel[ch].data&0x0f;
  mod.patternwait=0;
}
Fasttracker.prototype.effect_t0_ef=function(mod, ch) { // ef
}



//
// tick 1+ effect functions
//
Fasttracker.prototype.effect_t1_0=function(mod, ch) { // 0 arpeggio
  if (mod.channel[ch].data) {
    var i=mod.channel[ch].instrument;
    var apn=mod.channel[ch].note;
    if ((mod.tick%3)==1) apn+=mod.channel[ch].arpeggio>>4;
    if ((mod.tick%3)==2) apn+=mod.channel[ch].arpeggio&0x0f;

    var s=mod.channel[ch].sampleindex;
    mod.channel[ch].voiceperiod=mod.calcperiod(mod, apn+mod.instrument[i].sample[s].relativenote, mod.instrument[i].sample[s].finetune);
    mod.channel[ch].flags|=1;
  }
}
Fasttracker.prototype.effect_t1_1=function(mod, ch) { // 1 slide up
  mod.channel[ch].voiceperiod-=mod.channel[ch].slideupspeed;
  if (mod.channel[ch].voiceperiod<1) mod.channel[ch].voiceperiod=1;
  mod.channel[ch].flags|=3; // recalc speed
}
Fasttracker.prototype.effect_t1_2=function(mod, ch) { // 2 slide down
  mod.channel[ch].voiceperiod+=mod.channel[ch].slidedownspeed;
  if (mod.channel[ch].voiceperiod>7680) mod.channel[ch].voiceperiod=7680;
  mod.channel[ch].flags|=3; // recalc speed                
}
Fasttracker.prototype.effect_t1_3=function(mod, ch) { // 3 slide to note
  if (mod.channel[ch].voiceperiod < mod.channel[ch].slideto) {
    mod.channel[ch].voiceperiod+=mod.channel[ch].slidetospeed;
    if (mod.channel[ch].voiceperiod > mod.channel[ch].slideto)
      mod.channel[ch].voiceperiod=mod.channel[ch].slideto;
  }
  if (mod.channel[ch].voiceperiod > mod.channel[ch].slideto) {
    mod.channel[ch].voiceperiod-=mod.channel[ch].slidetospeed;
    if (mod.channel[ch].voiceperiod<mod.channel[ch].slideto)
      mod.channel[ch].voiceperiod=mod.channel[ch].slideto;
  }
  mod.channel[ch].flags|=3; // recalc speed
}
Fasttracker.prototype.effect_t1_4=function(mod, ch) { // 4 vibrato
  var waveform=mod.vibratotable[mod.channel[ch].vibratowave&3][mod.channel[ch].vibratopos]/63.0;
  var a=mod.channel[ch].vibratodepth*waveform;
  mod.channel[ch].voiceperiod+=a;
  mod.channel[ch].flags|=1;
}
Fasttracker.prototype.effect_t1_5=function(mod, ch) { // 5 volslide + slide to note
  mod.effect_t1_3(mod, ch); // slide to note
  mod.effect_t1_a(mod, ch); // volslide
}
Fasttracker.prototype.effect_t1_6=function(mod, ch) { // 6 volslide + vibrato
  mod.effect_t1_4(mod, ch); // vibrato
  mod.effect_t1_a(mod, ch); // volslide
}
Fasttracker.prototype.effect_t1_7=function(mod, ch) { // 7
}
Fasttracker.prototype.effect_t1_8=function(mod, ch) { // 8 unused

}
Fasttracker.prototype.effect_t1_9=function(mod, ch) { // 9 set sample offset
}
Fasttracker.prototype.effect_t1_a=function(mod, ch) { // a volume slide
  if (!(mod.channel[ch].data&0x0f)) {
    // y is zero, slide up
    mod.channel[ch].voicevolume+=(mod.channel[ch].data>>4);
    if (mod.channel[ch].voicevolume>64) mod.channel[ch].voicevolume=64;
  }
  if (!(mod.channel[ch].data&0xf0)) {
    // x is zero, slide down
    mod.channel[ch].voicevolume-=(mod.channel[ch].data&0x0f);
    if (mod.channel[ch].voicevolume<0) mod.channel[ch].voicevolume=0;                  
  }
}
Fasttracker.prototype.effect_t1_b=function(mod, ch) { // b pattern jump
}
Fasttracker.prototype.effect_t1_c=function(mod, ch) { // c set volume
}
Fasttracker.prototype.effect_t1_d=function(mod, ch) { // d pattern break
}
Fasttracker.prototype.effect_t1_e=function(mod, ch) { // e
  var i=(mod.channel[ch].data&0xf0)>>4;
  mod.effects_t1_e[i](mod, ch);
}
Fasttracker.prototype.effect_t1_f=function(mod, ch) { // f
}
Fasttracker.prototype.effect_t1_g=function(mod, ch) {} // g set global volume
Fasttracker.prototype.effect_t1_h=function(mod, ch) {} // h
Fasttracker.prototype.effect_t1_i=function(mod, ch) {} // i
Fasttracker.prototype.effect_t1_j=function(mod, ch) {} // j
Fasttracker.prototype.effect_t1_k=function(mod, ch) {} // k key off
Fasttracker.prototype.effect_t1_l=function(mod, ch) {} // l set envelope position
Fasttracker.prototype.effect_t1_m=function(mod, ch) {} // m
Fasttracker.prototype.effect_t1_n=function(mod, ch) {} // n
Fasttracker.prototype.effect_t1_o=function(mod, ch) {} // o
Fasttracker.prototype.effect_t1_p=function(mod, ch) {} // p panning slide
Fasttracker.prototype.effect_t1_q=function(mod, ch) {} // q
Fasttracker.prototype.effect_t1_r=function(mod, ch) {} // r multi retrig note
Fasttracker.prototype.effect_t1_s=function(mod, ch) {} // s
Fasttracker.prototype.effect_t1_t=function(mod, ch) {} // t tremor
Fasttracker.prototype.effect_t1_u=function(mod, ch) {} // u
Fasttracker.prototype.effect_t1_v=function(mod, ch) {} // v
Fasttracker.prototype.effect_t1_w=function(mod, ch) {} // w
Fasttracker.prototype.effect_t1_x=function(mod, ch) {} // x extra fine porta up/down
Fasttracker.prototype.effect_t1_y=function(mod, ch) {} // y
Fasttracker.prototype.effect_t1_z=function(mod, ch) {} // z



//
// tick 1+ effect e functions
//
Fasttracker.prototype.effect_t1_e0=function(mod, ch) { // e0
}
Fasttracker.prototype.effect_t1_e1=function(mod, ch) { // e1
}
Fasttracker.prototype.effect_t1_e2=function(mod, ch) { // e2
}
Fasttracker.prototype.effect_t1_e3=function(mod, ch) { // e3
}
Fasttracker.prototype.effect_t1_e4=function(mod, ch) { // e4
}
Fasttracker.prototype.effect_t1_e5=function(mod, ch) { // e5
}
Fasttracker.prototype.effect_t1_e6=function(mod, ch) { // e6
}
Fasttracker.prototype.effect_t1_e7=function(mod, ch) { // e7
}
Fasttracker.prototype.effect_t1_e8=function(mod, ch) { // e8
}
Fasttracker.prototype.effect_t1_e9=function(mod, ch) { // e9 retrig sample
  if (mod.tick%(mod.channel[ch].data&0x0f)==0) {
    mod.channel[ch].samplepos=0;
    mod.channel[ch].playdir=1;    
    
    mod.channel[ch].fadeoutpos=65535;
    mod.channel[ch].volenvpos=0;
    mod.channel[ch].panenvpos=0;    
  }
}
Fasttracker.prototype.effect_t1_ea=function(mod, ch) { // ea
}
Fasttracker.prototype.effect_t1_eb=function(mod, ch) { // eb
}
Fasttracker.prototype.effect_t1_ec=function(mod, ch) { // ec cut sample
  if (mod.tick==(mod.channel[ch].data&0x0f))
    mod.channel[ch].voicevolume=0;
}
Fasttracker.prototype.effect_t1_ed=function(mod, ch) { // ed delay sample
  mod.effect_t0_ed(mod, ch);
}
Fasttracker.prototype.effect_t1_ee=function(mod, ch) { // ee
}
Fasttracker.prototype.effect_t1_ef=function(mod, ch) { // ef
}
