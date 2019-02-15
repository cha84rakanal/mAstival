#include <nds.h>
#include <stdlib.h>
#include <stdlib.h>
#include <time.h>

//texture_bin.h is created automagicaly from the texture.bin placed in arm9/resources
//texture.bin is a raw 128x128 16 bit image.  I will release a tool for texture conversion 
//later
#include "texture2_bin.h"

int main() {	
	
	int textureID;

	int pos = 0;
	int ison = 0;
	int m_state = 0;

	srand((unsigned int)time(NULL));

	//set mode 0, enable BG0 and set it to 3D
	videoSetMode(MODE_0_3D);

	// initialize gl
	glInit();
	
	//enable textures
	glEnable(GL_TEXTURE_2D);
	
	// enable antialiasing
	glEnable(GL_ANTIALIAS);

	glEnable(GL_BLEND);
	
	// setup the rear plane
	glClearColor(31,31,31,31); // BG must be opaque for AA to work
	glClearPolyID(63); // BG must have a unique polygon ID for AA to work
	glClearDepth(0x7FFF);

	//this should work the same as the normal gl call
	glViewport(0,0,255,191);
	
	vramSetBankA(VRAM_A_TEXTURE);

	glGenTextures(1, &textureID);
	glBindTexture(0, textureID);
	glTexImage2D(0, 0, GL_RGB, TEXTURE_SIZE_256 , TEXTURE_SIZE_256, 0, TEXGEN_TEXCOORD, (u8*)texture2_bin); //ここいけるんちゃう？
	
	
	//any floating point gl call is being converted to fixed prior to being implemented
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective(70, 256.0 / 192.0, 0.1, 40);
	
	gluLookAt(	0.0, 0.0, 1.0,		//camera possition 
				0.0, 0.0, 0.0,		//look at
				0.0, 1.0, 0.0);		//up	
	
	while(1) {
		glMatrixMode(GL_MODELVIEW);
		glPushMatrix();

		//move it away from the camera
		glTranslatef32(0, 0, floattof32(-1));
		
		//glMaterialf(GL_AMBIENT, RGB15(16,16,16));
		//glMaterialf(GL_DIFFUSE, RGB15(16,16,16));
		//glMaterialf(GL_SPECULAR, BIT(15) | RGB15(8,8,8));
		//glMaterialf(GL_EMISSION, RGB15(16,16,16));

		glMaterialf(GL_AMBIENT, RGB15(31,31,31));
	    glMaterialf(GL_DIFFUSE, RGB15(31,31,31));
		glMaterialf(GL_SPECULAR, BIT(15) | RGB15(8,8,8));
		glMaterialf(GL_EMISSION, RGB15(31,31,31));

		//ds uses a table for shinyness..this generates a half-ass one
		glMaterialShinyness();

		scanKeys();
		
		u16 keys = keysHeld();
		
		//if((keys & KEY_UP)) rotateX += 3;
		//if((keys & KEY_DOWN)) rotateX -= 3;
		//if((keys & KEY_LEFT)) rotateY += 3;
		//if((keys & KEY_RIGHT)) rotateY -= 3;

		//not a real gl function and will likely change
		glPolyFmt(POLY_ALPHA(31) | POLY_CULL_BACK | POLY_MODULATION );
		
		glBindTexture(0, textureID);

		//glTranslatef32(((float)rand()/(float)(RAND_MAX))*500, ((float)rand()/(float)(RAND_MAX))*500, 0);
		//1/30発生
		//0-1 : ((float)rand()/(float)(RAND_MAX))
		// ((float)rand()/(float)(RAND_MAX)) * 31
		//		

		if(((int)(((float)rand()/(float)(RAND_MAX)) * 62)) == 15 && ison == 0){
			ison = 1;
			m_state = 1;
		}

		if(m_state == 0){
			pos = 0;
		}else if(m_state == 1){
			pos = 500;
			m_state = 2;
		}else if(m_state == 2){
			pos = 1000;
			m_state = 3;
		}else if(m_state == 3){
			//pos = 1000;
			m_state = 4;
		}else if(m_state == 4){
			//pos = 1000;
			m_state = 7;
		}else if(m_state == 5){
			//pos = 1000;
			m_state = 6;		
		}else if(m_state == 6){
			m_state = 7;
		}else if(m_state == 7){
			pos = 500;
			m_state = 8;
		}else if(m_state == 8){
			ison = 0;
			m_state = 0;
		}

		glTranslatef32(0 + pos,0,0);

		//draw the obj
		glBegin(GL_QUAD);
			glNormal(NORMAL_PACK(0,inttov10(-1),0));

			GFX_TEX_COORD = (TEXTURE_PACK(0, inttot16(256)));
			//glVertex3v16(floattov16(-0.5),	floattov16(-0.5), 0 );
			glVertex3v16(floattov16(-1.0),	floattov16(-1.0), 0 );
	
			GFX_TEX_COORD = (TEXTURE_PACK(inttot16(256),inttot16(256)));
			//glVertex3v16(floattov16(0.5),	floattov16(-0.5), 0 );
			glVertex3v16(floattov16(1.0),	floattov16(-1.0), 0 );
	
			GFX_TEX_COORD = (TEXTURE_PACK(inttot16(256 ), 0));
			//glVertex3v16(floattov16(0.5),	floattov16(0.5), 0 );
			glVertex3v16(floattov16(1.0),	floattov16(1.0), 0 );

			GFX_TEX_COORD = (TEXTURE_PACK(0,0));
			//glVertex3v16(floattov16(-0.5),	floattov16(0.5), 0 );
			glVertex3v16(floattov16(-1.0),	floattov16(1.0), 0 );
		
		glEnd();


/*
		glPolyFmt(POLY_ALPHA(15) | POLY_CULL_BACK | POLY_MODULATION );

		glTranslatef32(2000,0,0);

		//draw the obj
		glBegin(GL_QUAD);
			glNormal(NORMAL_PACK(0,inttov10(-1),0));

			GFX_TEX_COORD = (TEXTURE_PACK(0, inttot16(256)));
			//glVertex3v16(floattov16(-0.5),	floattov16(-0.5), 0 );
			glVertex3v16(floattov16(-1.5),	floattov16(-1.5), 0 );
	
			GFX_TEX_COORD = (TEXTURE_PACK(inttot16(256),inttot16(256)));
			//glVertex3v16(floattov16(0.5),	floattov16(-0.5), 0 );
			glVertex3v16(floattov16(1.5),	floattov16(-1.5), 0 );
	
			GFX_TEX_COORD = (TEXTURE_PACK(inttot16(256 ), 0));
			//glVertex3v16(floattov16(0.5),	floattov16(0.5), 0 );
			glVertex3v16(floattov16(1.5),	floattov16(1.5), 0 );

			GFX_TEX_COORD = (TEXTURE_PACK(0,0));
			//glVertex3v16(floattov16(-0.5),	floattov16(0.5), 0 );
			glVertex3v16(floattov16(-1.5),	floattov16(1.5), 0 );
		
		glEnd();
*/

		
		glPopMatrix(1);
			
		//glFlush(GL_TRANS_MANUALSORT);
		glFlush(0);

		swiWaitForVBlank();

		if(keys & KEY_START) break;
	}

	return 0;
}//end main 
