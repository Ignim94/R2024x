package com.atis.rest.modeler;

import com.atis.rest.service.cmgFindObject;
import com.dassault_systemes.platform.restServices.ModelerBase;
import jakarta.ws.rs.ApplicationPath;

@ApplicationPath("/Project2")
public class cmgProjectList extends ModelerBase{
	
		@Override
		public Class<?>[] getServices() {
			return new Class[] {
					cmgFindObject.class
					};
		}
	
}
