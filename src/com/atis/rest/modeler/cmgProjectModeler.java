package com.atis.rest.modeler;

import com.atis.rest.service.cmgFindObject;
import com.atis.rest.service.cmgProjectCRUD;
import com.atis.rest.service.cmgProjectList;
import com.dassault_systemes.platform.restServices.ModelerBase;
import jakarta.ws.rs.ApplicationPath;

@ApplicationPath(ModelerBase.REST_BASE_PATH+"/Project")
public class cmgProjectModeler extends ModelerBase{
	
		@Override
		public Class<?>[] getServices() {
			return new Class[] {
					cmgFindObject.class,
					cmgProjectCRUD.class,
					cmgProjectList.class
			};
	}
	
}
