/*
 * emxRMT3DNotification
 *
 * Copyright (c) 2007-2018 Dassault Systemes.
 *
 * All Rights Reserved.
 * This program contains proprietary and trade secret information of
 * MatrixOne, Inc.  Copyright notice is precautionary only and does
 * not evidence any actual or intended publication of such program.
 *
 * static const char RCSID[] = $Id: /ENORequirementsManagementBase/CNext/Modules/ENORequirementsManagementBase/JPOsrc/custom/${CLASSNAME}.java 1.2.2.1.1.1 Wed Oct 29 22:20:01 2008 GMT przemek Experimental$
 *
 */
import matrix.db.Context;

/**
 * Customization class for managing a Specification Structure
 * 
 *
 */
public class emxRMT3DNotification_mxJPO extends emxRMT3DNotificationBase_mxJPO
{
   /**
    * Overrides the base emxRMT3DNotification object.
    * 
    * @param context
    *                the eMatrix <code>Context</code> object
    * @param args
    *                holds no arguments
    * @return a emxRMT3DNotification object.
    * @throws Exception
    *                 if the operation fails
    */
   public emxRMT3DNotification_mxJPO(Context context, String[] args)
        throws Exception
   {
                super(context, args);
   }

}

