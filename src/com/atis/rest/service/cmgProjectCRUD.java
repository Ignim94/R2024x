package com.atis.rest.service;

import com.dassault_systemes.platform.restServices.RestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;

@Path("/projectCRUD")
public class cmgProjectCRUD extends RestService {

	@GET
	public Response getMsg(@Context HttpServletRequest request) {
		
		return null;
	}
	@POST
	public Response createProject(@Context HttpServletRequest request) {
			
			return null;
		}
	@PUT
	public Response updateProject(@Context HttpServletRequest request) {
		
		return null;
	}
	@DELETE
	public Response deleteProject(@Context HttpServletRequest request) {
		
		return null;
	}
}
