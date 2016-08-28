/*	 1211109 8 7 266 5 4 3 2 1 0
	x | | | o | 0 o | | | | x 0
	x | | | o |   o | | | | x
	x | | | o |   o | | | | |
	x | | | | |   o | | | | |
	x | | | | |   o | | | | |
							5  
								3
	o | | | | |   x | | | | |
	o | | | | |   x | | | | |
	o | | | x |   x | | | | |
	o | | | x |   x | | | | o
	o | | | x | 0 x | | | | o 0  
	1314151617182819202122232425
*/

var feld=new Array(28),
	symbol=new Array(3),
	line=new Array(12),
	voll=new Array(3),
	w1,w2,dran,selected,wuerfeln,pasch,i,l,ll,t,m1,m2,start,possible,min,max,temp,geschlagen,geht,zuege, lr;

for(i=0;i<29;i++)
	feld[i]=new Array(2)


$(document).ready(function(){
	for (i=0;i<12;i++){
		line[i]="";
	}
	for (i=0;i<4;i++){
		voll[i]=0;
	}
	start=0;
	w1='&diams;';
	w2='&diams;';
	symbol[0]='o';
	symbol[1]=' ';
	symbol[2]='x';
	for(i=0;i<29;i++)
		for(j=0;j<2;j++)
			feld[i][j]=0;	
	dran=0;
	selected='';
	wuerfeln=1;
	min=1;
	max=24;
	m1='';
	m2='';	
	
       
	feld[1][0]=1;
	feld[1][1]=2;

	feld[6][0]=-1;
	feld[6][1]=5;

	feld[8][0]=-1;
	feld[8][1]=3;

	feld[12][0]=1;
	feld[12][1]=5;

	feld[13][0]=-1; 
	feld[13][1]=5;

	feld[17][0]=1;
	feld[17][1]=3;

	feld[19][0]=1;
	feld[19][1]=5;

	feld[24][0]=-1;
	feld[24][1]=2;

	feld[26][0]=-1;
	feld[26][1]=0;
	
	feld[28][0]=1;
	feld[28][1]=0;

	feld[0][0]=-1;
	feld[0][1]=0;
	
	feld[25][0]=1;
	feld[25][1]=0;
	draw();
});


$(document).on('click', 'font',function(){
	var auswahl=$(this).attr('class');
	
	if(auswahl=="wuerfel"&&wuerfeln==1){
		w1=getRandomInt(1,6);
		var what="ever";
		w2=getRandomInt(1,6);
		if(dran==0){
			while(dran==0){
				w1=getRandomInt(1,6);
				w2=getRandomInt(1,6);
				if(w1>w2){
					dran=1; 
				}  
				if(w2>w1){
					dran=-1; 
				}  
			}
			wuerfeln=2;
			zuege=2;
		}else{
			if(w1==w2){
				pasch=true;
				zuege=4;
			}else{
				pasch=false;
				zuege=2;
			}
			wuerfeln=0;
			check();
			if(possible==false){
				wuerfeln=1;
				next();
			}
		}
		draw();
		return;
	}
	if(auswahl=="wuerfel"&&wuerfeln==2){
		wuerfeln=0;
		if(w1>w2){
			w2=getRandomInt(1,6);
		}else{
			w1=getRandomInt(1,6);
		} 
		if(w1==w2){
			pasch=true;
			zuege=4;
		}else{
			pasch=false;
			zuege=2;
		}
		draw();
		return;
	}
	if(auswahl!="wuerfel"&&wuerfeln!=1){
		wuerfeln=0;
		auswahl=auswahl.substr(1);
		if(selected==''){
			check_geschlagen();
			if(geschlagen==true&&auswahl==27+dran){
				checkMove(auswahl);
					if(geht){
						select(auswahl);
						return;
					}
				return;
			}
			if(!geschlagen&&auswahl>0&&auswahl<25){
				if(feld[auswahl][0]==dran){
					checkMove(auswahl);
					if(geht){
						select(auswahl);
						return;
					}
				}
			}
		}else{
			if(auswahl==m1||auswahl==m2){
				move(selected,auswahl);
				return;
			}
			if(auswahl==selected){
				selected='';
				draw();
				return;
			}
		}
	}
});

function move(von, nach){
	if(feld[nach][0]==dran||feld[nach][1]==0){
		feld[von][1]--;
		feld[nach][1]++;
		feld[nach][0]=dran;
		
	}
	if(feld[nach][0]!=dran && feld[nach][1]==1){
		feld[von][1]--;
		feld[nach][0]=dran;
		feld[27-dran][1]++;
	}

	if(feld[von][1]==0&&von!=27+dran){
		feld[von][0]=0;
	}
	selected='';
	zuege--;
	if(pasch==true){
		if(zuege==2){
			w1='&diams;';
		}
	}else{
		if(nach==m1){
			w1='&diams;';
		}
		else if(nach==m2){
			w2='&diams;';
		}
	}
	if(zuege==0){
		w2='&diams;';
		next();
		wuerfeln=1;
	}else{
		check();
		if(possible==false){
			wuerfeln=1;
			next();
		}
	}
	draw();
}

function select(nummer){
	checkFinish();
	selected=nummer;
	draw();
	m1='';
	m2='';
	if(nummer<25){
		if(w1>=1&&w1<=6){
			t=Number(nummer)+Number(w1)*Number(dran);
			if((voll[0]==1&&dran==-1&&t==0)||(voll[0]==1&&lr==Number(nummer)&&t<1&&dran==-1)){
				m1=0;
			}
			else if((voll[2]==1&&dran==1&&t==25)||(voll[2]==1&&lr==Number(nummer)&&t>24&&dran==1)){
				m1=25;
			}
			else if(feld[t][0]==dran||feld[t][1]<2){
				m1=t;
			}
		}
		if(w2>=1&&w2<=6){
			t=Number(nummer)+Number(w2)*Number(dran);
			if((voll[0]==1&&dran==-1&&t==0)||(voll[0]==1&&lr==Number(nummer)&&t<1&&dran==-1)){
				m2=0;
			}
			else if((voll[2]==1&&dran==1&&t==25)||(voll[2]==1&&lr==Number(nummer)&&t>24&&dran==1)){
				m2=25;
			}
			else if(feld[t][0]==dran||feld[t][1]<2){
				m2=t;
			}
		}
	}
	if(nummer==26){
		if(w1>=1&&w1<=6){
			t=25-Number(w1);
			if(feld[t][0]==dran||feld[t][1]<2){
				m1=t;
			}
		}
		if(w2>=1&&w2<=6){
			t=25-Number(w2);
			if(feld[t][0]==dran||feld[t][1]<2){
				m2=t;
			}
		}
	}
	if(nummer==28){
		if(w1>=1&&w1<=6){
			t=w1;
			if(feld[t][0]==dran||feld[t][1]<2){
				m1=t;
			}
		}
		if(w2>=1&&w2<=6){
			t=w2;
			if(feld[t][0]==dran||feld[t][1]<2){
				m2=t;
			}
		}
	}
}

function checkMove(position){
	geht=false;
	checkFinish();
	if(position>0&&position<25&&feld[27+dran][1]==0){//FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU
		if(w1>=1&&w1<=6){
			t=Number(position)+Number(w1)*Number(dran);
			if((dran==-1&&t<1&&voll[0]==1&&lr==Number(position))||(dran==1&&t>24&&voll[2]==1&&lr==Number(position))){
				geht=true;
				return;
			}
			if(t>=min&&t<=max){
				if(feld[t][0]==dran||feld[t][1]<2){
					geht=true;
					return;
				}
			}
		}
		if(w2>=1&&w2<=6){
			t=Number(position)+Number(w2)*Number(dran);
			if((dran==-1&&t<1&&voll[0]==1&&lr==Number(position))||(dran==1&&t>24&&voll[2]==1&&lr==Number(position))){
				geht=true;
				return;
			}
			if(t>=min&&t<=max){
				if(feld[t][0]==dran||feld[t][1]<2){
					geht=true;
					return;
				}
			}
		}
	}
	if(position==26&&feld[27+dran][1]!=0){
		if(w1>=1&&w1<=6){
			if(feld[25-Number(w1)][0]==dran||feld[25-Number(w1)][1]<2){
				geht=true;
				return;
			}
		}
		if(w2>=1&&w2<=6){
			if(feld[25-Number(w2)][0]==dran||feld[25-Number(w2)][1]<2){
				geht=true;
				return;
			}
		}
	}
	if(position==28&&feld[27+dran][1]!=0){
		if(w1>=1&&w1<=6){
			if(feld[Number(w1)][0]==dran||feld[Number(w1)][1]<2){
				geht=true;
				return;
			}
		}
		if(w2>=1&&w2<=6){
			if(feld[Number(w2)][0]==dran||feld[Number(w2)][1]<2){
				geht=true;
				return;
			}
		}
	}
	return;
}

function check(){
	checkFinish();
	possible=false;
	if(feld[27+dran][1]>0){
		if(dran==1){
			if(w1>=1&&w1<=6){
				if(feld[w1][0]==dran||feld[w1][1]<2){
					possible=true;
					return;
				}
			}
			if(w2>=1&&w2<=6){
				if(feld[w2][0]==dran||feld[w2][1]<2){
					possible=true;
					return;
				}
			}
		}else{
			if(w1>=1&&w1<=6){
				if(feld[25-w1][0]==dran||feld[25-w1][1]<2){
					possible=true;
					return;
				}
			}
			if(w2>=1&&w2<=6){
				if(feld[25-w2][0]==dran||feld[25-w2][1]<2){
					possible=true;
					return;
				}
			}
		}
	}else{
		if(voll[1+dran]==0){
			for(i=1;i<25;i++){
				if(feld[i][0]==dran){
					if(w1>=1&&w1<=6){
						t=Number(i)+Number(w1)*Number(dran);
						if(t>=min&&t<=max){
							if(feld[t][0]==dran||feld[t][1]<2){
								possible=true;
								return;
							}
						}
					}
					if(w2>=1&&w2<=6){
						t=Number(i)+Number(w2)*Number(dran);
						if(t>=min&&t<=max){
							if(feld[t][0]==dran||feld[t][1]<2){
								possible=true;
								return;
							}
						}
					}
				}
			}
		}else{
			if(dran==-1){
				for(i=1;i<7;i++){
					if(feld[i][0]==dran){
						if(w1>=1&&w1<=6){
							t=Number(i)+Number(w1)*Number(dran);
							if(t==0||(t<0&&i==lr)||(t>0&&feld[t][0]==dran)||(t>0&&feld[t][1]<2)){
								possible=true;
								return;
							}
						}
						if(w2>=1&&w2<=6){
							t=Number(i)+Number(w2)*Number(dran);
							if(t==0||(t<0&&i==lr)||(t>0&&feld[t][0]==dran)||(t>0&&feld[t][1]<2)){
								possible=true;
								return;
							}
						}
					}
				}
			}else{
				for(i=19;i<25;i++){
					if(feld[i][0]==dran){
						if(w1>=1&&w1<=6){
							t=Number(i)+Number(w1)*Number(dran);
							if(t==25||(t>25&&i==lr)||(t<25&&feld[t][0]==dran)||(t<25&&feld[t][1]<2)){
								possible=true;
								return;
							}
						}
						if(w2>=1&&w2<=6){
							t=Number(i)+Number(w2)*Number(dran);
							if(t==25||(t>25&&i==lr)||(t<25&&feld[t][0]==dran)||(t<25&&feld[t][1]<2)){
								possible=true;
								return;
							}
						}
					}
				}
			}
		}
	}
}

function checkFinish(){
	for (i=0;i<4;i++){
		voll[i]=0;
	}
	min=1;
	max=24;
	temp=0;
	for(i=25;i>18;i--){
		if(feld[i][0]==1&&dran==1){
			temp+=Number(feld[i][1]);
			lr=i;
		}
	}
	if(temp==15){
		max=25;
		voll[2]=1;
	}
	temp=0;
	for(i=0;i<7;i++){
		if(feld[i][0]==-1&&dran==-1){
			temp+=Number(feld[i][1]);
			lr=i;
		}
	}
	if(temp==15){
		min=0;
		voll[0]=1;
	}
}

function check_geschlagen(){
	geschlagen=false;
	if(feld[27+dran][1]>0){
		geschlagen=true;
	}
}

function next(){
	dran=Number(dran)+Number(-2)*Number(dran);
	selected='';
}

function getRandomInt(mini, maxi) {
	return Math.floor(Math.random() * (maxi - mini + 1)) + mini;
}

function draw(){
	for (i=0;i<12;i++)
		line[i]="";
	
	for(l=0;l<5;l++){
		for(i=12;i>0;i--){
			line[l]+='<font class="f'+i+'">';
			if(feld[i][1]!=0){
				if(l+1<=feld[i][1]){
					if(i==selected && l+1==feld[i][1]){
						line[l]+='</font><font id="selected" class="f'+i+'">';
					}
					line[l]+=symbol[feld[i][0]+1]+"&nbsp;";
				} else {
					line[l]+="|&nbsp;";
				}
			} else {
				line[l]+="|&nbsp;";
			}
			line[l]+="</font>";
			if(i==7){//Mitte
				if(l==0){
					if(feld[26][1]>0){
						if(selected==26){
							line[l]+='<font id="selected" class="f26">';
						}else{
							line[l]+='<font color="yellow" class="f26">';
						}
						line[l]+=feld[26][1];
						if(feld[26][1]<10)
							line[l]+="&nbsp;";
					} else {
						line[l]+="&nbsp;&nbsp;";
					}
					line[l]+="</font>";
				}else{
					if(l==4){//Pfeil
						if(dran==1)
							line[l]+='<font color="#1B860F">&larr;&nbsp;</font>';
						else
							if(dran==-1)
								line[l]+='<font color="#1B860F">&rarr;&nbsp;</font>';
							else
								line[l]+="&nbsp;&nbsp;";
					}else{
						line[l]+="&nbsp;&nbsp;";
					}
				}
			}
			if(i==1&&l==0){
				line[l]+='<font class="f0" color="yellow">'+feld[0][1]+'</font>&nbsp;';
			}
		}
	}
	l=5;
	for(i=12;i>0;i--){
		if(i==selected){
			line[l]+='<font id="selected" class="f'+i+'">';
		}
		else{
			line[l]+='<font class="f'+i+'">';
		}
		if(feld[i][1]>5){
			if(feld[i][1]>6){
				line[l]+=feld[i][1]-5;
			}else{
				line[l]+=symbol[feld[i][0]+1];
			}
			line[l]+="&nbsp;";
		}else{
			line[l]+="&nbsp;&nbsp;";
		}
		if(i==7){
			line[l]+="&nbsp;&nbsp;";
		}
		line[l]+="</font>";
	}
	line[l]+='<font class="wuerfel" color="#92C6CD">'+w1+'</font>&nbsp;';
	
	l=6;
	for(i=13;i<25;i++){
		if(i==selected){
			line[l]+='<font id="selected" class="f'+i+'">';
		}
		else{
			line[l]+='<font class="f'+i+'">';
		}
		if(feld[i][1]>5){
			if(feld[i][1]>6){
				line[l]+=feld[i][1]-5;
			}else{
				line[l]+=symbol[feld[i][0]+1];
			}
			line[l]+="&nbsp;";
		}else{
			line[l]+="&nbsp;&nbsp;";
		}
		if(i==18){
			line[l]+="&nbsp;&nbsp;";
		}
		line[l]+="</font>";
	}	
	line[l]+='&nbsp;&nbsp;<font class="wuerfel" color="#92C6CD">'+w2+'</font>';
	
	ll=5;
	for(l=7;l<12;l++){
		for(i=13;i<25;i++){
			line[l]+='<font class="f'+i+'">';
			if(feld[i][1]!=0){
				if(ll<=feld[i][1]){
					if(i==selected && ll==feld[i][1]){
						line[l]+='</font><font id="selected" class="f'+i+'">';
					}
					line[l]+=symbol[feld[i][0]+1]+"&nbsp;";
				} else {
					line[l]+="|&nbsp;";
				}
			} else {
				line[l]+="|&nbsp;";
			}
			line[l]+="</font>";
			if(i==18){//Mitte
				if(ll==1){
					if(feld[28][1]>0){
						if(selected==28){
							line[l]+='<font id="selected" class="f28">';
						}else{
							line[l]+='<font color="yellow" class="f28">';
						}
						line[l]+=feld[28][1];
						if(feld[28][1]<10)
							line[l]+="&nbsp;";
					} else {
						line[l]+="&nbsp;&nbsp;";
					}
					line[l]+="</font>";
				}else{
					if(ll==5){//Pfeil
						if(dran==1)
							line[l]+='<font color="#1B860F">&rarr;&nbsp;</font>';
						else
							if(dran==-1)
								line[l]+='<font color="#1B860F">&larr;&nbsp;</font>';
							else
								line[l]+="&nbsp;&nbsp;";
					}else{
						line[l]+="&nbsp;&nbsp;";
					}
				}
			}
			if(i==24&&ll==1){
				line[l]+='<font class="f25" color="yellow">'+feld[25][1]+'</font>&nbsp;';
			}
		}
		ll--;
	}
	var htm="";
	for(i=0;i<12;i++)
		htm+=line[i]+"<br>";
	$("#backgammon").empty().append(htm);
}

