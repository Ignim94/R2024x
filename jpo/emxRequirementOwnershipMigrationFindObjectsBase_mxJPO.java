/*
 ** ${CLASSNAME}
 **
 ** Copyright (c) 1993-2020 Dassault Systemes. All Rights Reserved.
 ** This program contains proprietary and trade secret information of
 ** Dassault Systemes.
 ** Copyright notice is precautionary only and does not evidence any actual
 ** or intended publication of such program
 */

import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileWriter;

import com.matrixone.apps.domain.util.MqlUtil;

import matrix.db.Context;
import matrix.util.StringList;

public class emxRequirementOwnershipMigrationFindObjectsBase_mxJPO extends emxCommonFindObjects_mxJPO
{
    String migrationProgramName = "emxRequirementOwnershipMigration";

    /**
     *
     * @param context the eMatrix <code>Context</code> object
     * @param args holds no arguments
     * @throws Exception if the operation fails
     * @grade 0
     */
    public emxRequirementOwnershipMigrationFindObjectsBase_mxJPO (Context context, String[] args)
        throws Exception
    {    	
     super(context, args);    
    }

    /**
     * Evalutes a temp query to get all objects that need to be migrated in the system
     * @param context the eMatrix <code>Context</code> object
     * @param chunksize has the no. of objects to be stored in file.
     * @return void
     * @exception Exception if the operation fails.
     */
    public void getIds(Context context, int chunkSize) throws Exception
    {
        String vaultList = "*";
                             
    	String whereClause = "(ownership != \"\") && (program[" + migrationProgramName + " -method writeOID ${OBJECTID} \"${TYPE}\"] == true)";
        String cmdParameterized = "temp query bus $1 $2 $3  vault $4 limit $5 where $6";
        
        
        //reset/set static variabless back to original values every time this JPO is run
        emxRequirementOwnershipMigration_mxJPO._counter  = 0;
        emxRequirementOwnershipMigration_mxJPO._sequence  = 1;
        emxRequirementOwnershipMigration_mxJPO._oidsFile = null;
        emxRequirementOwnershipMigration_mxJPO._fileWriter = null;
        emxRequirementOwnershipMigration_mxJPO._objectidList = null;

        //set statics
        //create BW and file first time
        if (emxRequirementOwnershipMigration_mxJPO._fileWriter == null)
        {
            try
            {
            	emxRequirementOwnershipMigration_mxJPO.documentDirectory = documentDirectory;
            	emxRequirementOwnershipMigration_mxJPO._oidsFile = new java.io.File(documentDirectory + "objectids_1.txt");
            	emxRequirementOwnershipMigration_mxJPO._fileWriter = new BufferedWriter(new FileWriter(emxRequirementOwnershipMigration_mxJPO._oidsFile));
            	emxRequirementOwnershipMigration_mxJPO._chunk = chunkSize;
            	emxRequirementOwnershipMigration_mxJPO._objectidList = new StringList(chunkSize);
            }
            catch(FileNotFoundException eee)
            {
                throw eee;
            }
        }

        try
        {
        	MqlUtil.mqlCommand(context, cmdParameterized, type , "*", "*", vaultList, chunkSize + "", whereClause);

        }
        catch(Exception me)
        {
            throw me;
        }

        // call cleanup to write the left over oids to a file
        emxRequirementOwnershipMigration_mxJPO.cleanup();
    }
}
