package com.atis.rest.modeler;

import com.dassault_systemes.platform.restServices.ModelerBase;
import com.atis.rest.service.cmgFindObject;
import com.atis.rest.service.cmgObjectInfo;

import jakarta.ws.rs.ApplicationPath;

@ApplicationPath(ModelerBase.REST_BASE_PATH+"/CommonModel")
public class cmgCommonModeler extends ModelerBase{

	@Override
	public Class<?>[] getServices() {
		return new Class[] {
				cmgFindObject.class,
				cmgObjectInfo.class
			};
	}
}
