/*
** emxProductBase
**
** Copyright (c) 1992-2020 Dassault Systemes.
**
** All  Rights Reserved.
** This program contains proprietary and trade secret information of
** MatrixOne, Inc.  Copyright notice is precautionary only and does
** not evidence any actual or intended publication of such program.
**
** static const char RCSID[] = $Id: /ENOProductLine/CNext/Modules/ENOProductLine/JPOsrc/base/${CLASSNAME}.java 1.17.2.9.1.1 Wed Oct 29 22:17:06 2008 GMT przemek Experimental$
*/

import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Hashtable;
import java.util.HashSet;
import java.text.ParseException;
import java.util.Vector;
import java.util.StringTokenizer;
import java.util.Enumeration;
import java.util.Set;

/*Start of Add by Sandeep, Enovia MatrixOne for Bug # 310542*/

import matrix.db.BusinessTypeList;

/*End of Add by Sandeep, Enovia MatrixOne for Bug # 310542*/


import matrix.db.Context;
import matrix.db.Policy;
import matrix.db.State;
import matrix.db.BusinessObject;
import matrix.db.JPO;
import matrix.db.RelationshipType;
import matrix.db.BusinessObjectWithSelectList;
import matrix.db.BusinessType;
import matrix.util.StringList;
import matrix.util.Pattern;

import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.DateUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.domain.util.eMatrixDateFormat;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.i18nNow;
import com.matrixone.apps.domain.util.mxType;
import com.matrixone.apps.framework.ui.UINavigatorUtil;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.common.Person;
import com.matrixone.apps.productline.Product;
import com.matrixone.apps.productline.DerivationUtil;
import com.matrixone.apps.productline.ProductLineCommon;
import com.matrixone.apps.productline.ProductLineConstants;
import com.matrixone.apps.productline.ProductLineUtil;
import com.sun.tools.sjavac.server.SysInfo;
import com.dassault_systemes.enovia.productline.modeler.Model;
import com.exalead.papi.protocol.v5.CommitTransactionCommand;

/**
 * The <code>emxProductBase</code> class contains methods related to the admin type Products.
 * This includes methods for the Filter, Create, Delete, Remove and Copy Products.
 * @author Enovia MatrixOne
 * @version ProductCentral 10.0.0.0 - Copyright (c) 2003, MatrixOne, Inc.
 */
public class atisFormulationUpdate_mxJPO
{
	/*
	 * 1.변경된 오브젝트의 상위개체의 타입을 찾아라.
	 * 1-1. 포뮬레이션이면, 하위 1래밸의 원재료들의 atisWeight 값의 총합을 parentOID를 이용해서 넣어라
	 * 1-2. 원재료면, fromId를 찾고 atisWeight값에 넣어주고 상위에 값이 있다면 또.. 바꿔줘야겠지.
	 */

	
    public Vector getAtisWeight(Context context, String[] args) throws Exception{
    	
    	Vector vec = new Vector();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
    	MapList objList = (MapList) programMap.get("objectList");
    	HashMap paramList = (HashMap) programMap.get("paramList");
    	
    	String value ="";
    	String atisWeight ="";
    	String trueChild = "true";
    	for(Object o : objList) {
    		
    		Map rawMap = (Map) o;
    		String objId = (String) rawMap.get("id");
    		String relId = (String) rawMap.get("id[connection]");
    		String level = (String) rawMap.get("level");
    		String hasChildren = (String) rawMap.get("hasChildren");
    		try {
	    		if(!level.equals("0")) {
		    		DomainRelationship rDom = new DomainRelationship(relId);
		    		value = rDom.getAttributeValue(context, "atisWeight");
		    		
		    		if(hasChildren.equals(trueChild) || hasChildren == null) {
		    			DomainObject oDom = new DomainObject(objId);
		    			value = oDom.getAttributeValue(context, "atisWeight");
		    			vec.add(value);
		    			System.out.println("atisWeight:" + value);
		    		}
		    		System.out.println("atisWeight:" + value);
		    		vec.add(value);
	    		}else {
	    			DomainObject dom = new DomainObject(objId);
	    			value = dom.getAttributeValue(context, "atisWeight");
		    		vec.add(value);
	    		}
    		}catch(Exception e) {
    			System.out.println("atisWeight:" + value);
    			vec.add(value);
    		}
    	}
     	
    	
    	return vec;
    }
	
	
	
    public void updateAtisWeight(Context context, String[] args) throws Exception{
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
    	HashMap requestMap = (HashMap) programMap.get("requestMap");
    	HashMap paramMap = (HashMap) programMap.get("paramMap");
    	//getAtisWeight(context,args);
    	
    	String formulaType = "Formulation Part";                
    	String RawType ="Raw Material";                         
    	String atisWeight = "atisWeight";                       
    	

    	String parentId = (String) requestMap.get("parentOID");
    	String objectId = (String) paramMap.get("objectId");
    	String relId = (String) paramMap.get("relId");
    	String newValue = (String) paramMap.get("New Value");
    	//double newValue = Double.parseDouble((String)paramMap.get("new Value"));
    	// parentOID는 무조건 포뮬레이션파트로 들어감.
    	System.out.println("포뮬레이션 parentOID: " +parentId);
    	System.out.println("수정 개체: " + objectId);
    	
    	DomainRelationship rel = new DomainRelationship(relId);

    	try{ // 수정된 개체 새로운 값 적용.
    		
    		ContextUtil.startTransaction(context, true);
    		ContextUtil.commitTransaction(context);
    		rel.setAttributeValue(context, atisWeight, newValue);
    		ContextUtil.commitTransaction(context);
    		
    	}catch(Exception e){
    		ContextUtil.abortTransaction(context);
    		e.printStackTrace();
    	}
    	
    	// 무게 총합 변경.
    	
    	StringList relType = new StringList();
    	relType.add(rel.SELECT_FROM_TYPE);
    	relType.add(rel.SELECT_FROM_ID);
    	Hashtable hash = rel.getRelationshipData(context, relType);
		String getType = hash.get("from.type").toString();
		 //Hashtable<?,?> hashtable = (Hashtable<?,?>)hash.get(0); //String
		//getType = (String)hashtable.get("from.type");
		StringList busSelects = new StringList();
		busSelects.add(DomainConstants.SELECT_ID);
		busSelects.add(DomainConstants.SELECT_NAME);
		StringList relSelects = new StringList();
		
		if(getType.contains(formulaType)){
			System.out.println("type: "+formulaType);
			String setAttr = setParentObjAtisWeight(context,args,parentId,RawType,atisWeight);
			
		}else if(getType.contains(RawType)){			
			System.out.println("type: "+RawType);
			String pId = hash.get("from.id[connection]").toString().replaceAll("\\[|\\]", "");
			System.out.println(pId);
			String setAttr = setParentObjAtisWeight(context,args,pId,RawType,atisWeight);
			if(!setAttr.contains("finish")) {
				System.out.println("모개체 복합원재료만 수정되었음");
			}
		}
		    	
    } 
    
    
    
    public void fixConnectPostSetAttr(Context context, String[] args) throws Exception{
    	
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
    	HashMap requestValuesMap = (HashMap)programMap.get("RequestValuesMap");

    	//HashMap parentIdMap = (HashMap) programMap.get("objectId");
    	String toid = (String) programMap.get("toid"); // 연결된 대상
    	String parentId = (String) programMap.get("parentOID"); // 무조건 포뮬
    	String RawType ="Raw Material";                         
    	String atisWeight = "atisWeight";
    	String atisTargetCost = "atis Target Cost";
    	
    	// 복합원재료 추가시, 필요한 부분 [S]
    	MapList dMap = new MapList();
    	String multiRawId =  "";
    	String mrId       =  "";
    	StringList busSelects = new StringList();
		busSelects.add(DomainConstants.SELECT_ID);
		busSelects.add(DomainConstants.SELECT_NAME);
		StringList relSelects = new StringList();
		relSelects.add(DomainConstants.SELECT_RELATIONSHIP_ID);
		
    	String emxTableRowId = (String) programMap.get("emxTableRowId"); // 복합원재료인경우 미리 계산해서박아줘야함
    	if(!(emxTableRowId==null)) {
    		multiRawId = emxTableRowId.substring(1, emxTableRowId.length()-1);
    		String[] mRIArr     = multiRawId.split("\\|");
    		mrId       = mRIArr[0]; // 복합원재료 ID
    		System.out.println("mrId : "+mrId+", toid : "+toid);
    		DomainObject mDom = new DomainObject(toid);
        	dMap = mDom.getRelatedObjects(context,"EBOM","Raw Material",
        			busSelects, relSelects, false, true, (short)1, null, null);
    	}
    	// 복합원재료 추가시, 필요한 부분 [E]

    	if(dMap.size()>0) {
    		ContextUtil.startTransaction(context, true);
    		String relId = MqlUtil.mqlCommand(context, "print bus $1 select $2 dump",
    				parentId,"from[Formula Ingredient|to.id=='"+toid+"'].id");
            setParentObjAtisWeight(context,args,toid,RawType,relId);
            ContextUtil.commitTransaction(context);

    	}
    	
    	String objectId = (String) programMap.get("objectId"); // 개체추가시 모개체
    	DomainObject dom = new DomainObject(objectId);
    	String selectObjType = dom.getType(context);
    	String setAttr = "";

        setAttr = setParentObjAtisWeight(context,args,parentId,RawType,atisWeight);
        String setTargetCost = setParentObjAtisTC(context,args,parentId,RawType,atisTargetCost);

    	System.out.println("postsetattr");
    }
    
    
    public String setParentObjAtisWeight(Context context,String[] args, String parentId
    		,String RawType, String weightOrId) throws Exception{
    	
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);

    	String atisWeight = "atisWeight";
    	String relName = "Formula Ingredient";
    	String clear = "Finish";
    	String type_RawMaterial="";
    	//String relationship_formula_name = relName;
    	DomainObject pDom = new DomainObject(parentId);
    	//DomainRelationship pRel = new DomainRelationship(relId);
    	String domType = pDom.getType(context);
    	if(domType.equals("Raw Material")) {
    		relName = "EBOM";
    		clear = "Raw Material.. 상위개체 변경 필요함.";
    		
    	}
    	StringList busSelects = new StringList();
		busSelects.add(DomainConstants.SELECT_ID);
		busSelects.add(DomainConstants.SELECT_NAME);
		StringList relSelects = new StringList();
		relSelects.add(DomainConstants.SELECT_RELATIONSHIP_ID);
		
		MapList RawMap = pDom.getRelatedObjects(context,
				relName,//rel_name
				RawType, //to_type
				busSelects, // obj_select
				relSelects, // rel_select
				false, // to로부터 찾냐.
				true,//from에서부터 찾냐.
				(short) 1, // 몇래밸
				null, //오브젝트 조건
				null);
		
		System.out.println("맵리스팅완료");
		double wSum = 0.0;
		for( Object o : RawMap) {
			Map rawMap = (Map) o;
			//String oId = (String) rawMap.get("id");
			String rId = (String) rawMap.get("id[connection]");
			DomainRelationship oIdDom = new DomainRelationship(rId);
			double w = Double.parseDouble(oIdDom.getAttributeValue(context, "atisWeight"));
			wSum += w;
			
		}
		System.out.println("저장되어야할 총 무게:"+wSum);
		//String Sum = Double.toString(wSum);
		if(relName=="EBOM") {
			DomainRelationship rDom = new DomainRelationship(weightOrId);
			rDom.setAttributeValue(context, atisWeight, Double.toString(wSum));
		}
		else {
			pDom.setAttributeValue(context, atisWeight, Double.toString(wSum));
		}
		//pDom.setAttributeValue(context, atisWeight, Double.toString(wSum));

		System.out.println("저장된 총 무게:"+pDom.getAttributeValue(context, "atisWeight"));
		//System.out.println("저장된 총 무게:"+pRel.getAttributeValue(context, "atisWeight"));
    	
		return clear;
    }
    

    
    public StringList accessUpdate(Context context, String[] args) throws Exception{
    	
    	StringList slReturn = new StringList();
    	try {
	    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
	    	MapList objList = (MapList) programMap.get("objectList");
	    	
	    	for(Object o : objList) {
	    		
	    		Map rawMap = (Map) o;
	    		try {
		    		MapList childMap = (MapList) rawMap.get("children");
		    		
		    		if(childMap==null) {
		    			String id = (String) rawMap.get("id");
		    			DomainObject dom = new DomainObject(id);
		    			System.out.println("edit access id: "+id+", name: "+dom.getName(context));
		    			String hasChild = (String) rawMap.get("hasChildren");
		    			String hasEBOM = (String) rawMap.get("from[EBOM]");
		    			String relationship = (String) rawMap.get("relationship");
		    			//if(hasChild.equals("null")|| hasChild.isEmpty()) {
			    		if((hasChild==null)|| "null".equals(hasChild)) {
			    			if(relationship.equals("EBOM") && hasEBOM.equals("FALSE")) {
			    				slReturn.add("false");
			    			}else {
			    			slReturn.add("true");
			    			}
			    		}else if(hasChild.equals("false")){
			    			if(relationship.equals("EBOM") && hasEBOM.equals("FALSE")) {
			    				slReturn.add("false");
			    			}else {
			    			slReturn.add("true");
			    			}
			    		}else if(hasEBOM.equals("true")){
			    			slReturn.add("false");
			    		}else if(relationship.equals("EBOM") && hasChild.equals("false")){
			    			slReturn.add("false");
			    		}else if(hasChild == "null"){
			    			slReturn.add("false");
			    		}else {
			    		
			    			slReturn.add("false");
			    		}
		    		}else {
		    			slReturn.add("false");
	
		    		}
	    		}catch(Exception e){
	    			slReturn.add("true");
	    		}
	    	}
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    	return slReturn;
    }
    
    
    public String calAtisWeight(Context context,String[] args, String objId
    		,String level, String value) throws Exception{
    	
    	String RawType = "Raw Material";
    	String relName = "";
    	
    	if(level=="1") {
    		relName = "Formula Ingredient";
    	}else {
    		relName = "EBOM";
    	}
    	String clear = "Finish";
    	String type_RawMaterial="";
    	//String relationship_formula_name = relName;
    	DomainObject oDom = new DomainObject(objId);
    	//DomainRelationship pRel = new DomainRelationship(relId);
    	String domType = oDom.getType(context);
    	StringList busSelects = new StringList();
		busSelects.add(DomainConstants.SELECT_ID);
		busSelects.add(DomainConstants.SELECT_NAME);
		StringList relSelects = new StringList();
		relSelects.add(DomainConstants.SELECT_RELATIONSHIP_ID);
		
		MapList RawMap = oDom.getRelatedObjects(context,
				relName,//rel_name
				RawType, //to_type
				busSelects, // obj_select
				relSelects, // rel_select
				false, // to로부터 찾냐.
				true,//from에서부터 찾냐.
				(short) 1, // 몇래밸
				null, //오브젝트 조건
				null);
		
		System.out.println("맵리스팅완료");
		double wSum = 0.0;
		for( Object o : RawMap) {
			Map rawMap = (Map) o;
			String oId = (String) rawMap.get("id");
			String rId = (String) rawMap.get("id[connection]");
			DomainObject oIdDom = new DomainObject(oId);
			//oIdDom.get
			//DomainRelationship rIdDom = new DomainRelationship(rId);
			//double w = Double.parseDouble(rIdDom.getAttributeValue(context, "atisWeight"));
			//wSum += w;
			
		}
		System.out.println("저장되어야할 총 무게:"+wSum);
		
		return "clear";
    }
    
 
    // *************************************************************************
    
    
    public Vector getAtisTargetCost(Context context, String[] args) throws Exception{
    	
    	Vector vec = new Vector();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
    	MapList objList = (MapList) programMap.get("objectList");
    	String value ="";
    	String trueChild = "true";
    	for(Object o : objList) {
    		
    		Map rawMap = (Map) o;
    		String objId = (String) rawMap.get("id");
    		String relId = (String) rawMap.get("id[connection]");
    		String level = (String) rawMap.get("level");
    		String hasChildren = (String) rawMap.get("hasChildren");
    		try {
	    		if(!level.equals("0")) {
		    		DomainRelationship rDom = new DomainRelationship(relId);
		    		value = rDom.getAttributeValue(context, "atis Target Cost");
		    		if(hasChildren.equals(trueChild)) {
		    			DomainObject oDom = new DomainObject(objId);
		    			value = oDom.getAttributeValue(context, "atis Target Cost");
		    		}
		    		vec.add(value);
	    		}else {
	    			DomainObject dom = new DomainObject(objId);
	    			value = dom.getAttributeValue(context, "atis Target Cost");
		    		vec.add(value);
	    		}
    		}catch(Exception e) {
    			System.out.println("atisWeight:" + value);
    			vec.add(value);
    		}
    	}
     	
    	
    	return vec;
    }
    
    public void updateAtisTargetCost(Context context, String[] args) throws Exception{
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
    	HashMap requestMap = (HashMap) programMap.get("requestMap");
    	HashMap paramMap = (HashMap) programMap.get("paramMap");
    	//getAtisWeight(context,args);
    	
    	String formulaType = "Formulation Part";                
    	String RawType = "Raw Material";                         
    	String atisTargetCost = "atis Target Cost";                       
    	

    	String parentId = (String) requestMap.get("parentOID");
    	String objectId = (String) paramMap.get("objectId");
    	String relId = (String) paramMap.get("relId");
    	String newValue = (String) paramMap.get("New Value");
    	//double newValue = Double.parseDouble((String)paramMap.get("new Value"));
    	// parentOID는 무조건 포뮬레이션파트로 들어감.
    	System.out.println("포뮬레이션 parentOID: " +parentId);
    	System.out.println("수정 개체: " + objectId);
    	
    	DomainRelationship rel = new DomainRelationship(relId);

    	try{ // 수정된 개체 새로운 값 적용.
    		
    		ContextUtil.startTransaction(context, true);
    		rel.setAttributeValue(context, atisTargetCost, newValue);
    		ContextUtil.commitTransaction(context);
    		
    	}catch(Exception e){
    		ContextUtil.abortTransaction(context);
    		e.printStackTrace();
    	}
    	
    	// 무게 총합 변경.
    	
    	StringList relType = new StringList();
    	relType.add(rel.SELECT_FROM_TYPE);
    	relType.add(rel.SELECT_FROM_ID);
    	Hashtable hash = rel.getRelationshipData(context, relType);
		String getType = hash.get("from.type").toString();
		 //Hashtable<?,?> hashtable = (Hashtable<?,?>)hash.get(0); //String
		//getType = (String)hashtable.get("from.type");
		StringList busSelects = new StringList();
		busSelects.add(DomainConstants.SELECT_ID);
		busSelects.add(DomainConstants.SELECT_NAME);
		StringList relSelects = new StringList();
		
		if(getType.contains(formulaType)){
			System.out.println("type: "+formulaType);
			String setAttr = setParentObjAtisTC(context,args,parentId,RawType,atisTargetCost);
			
		}else if(getType.contains(RawType)){			
			System.out.println("type: "+RawType);
			String pId = hash.get("from.id[connection]").toString().replaceAll("\\[|\\]", "");
			System.out.println(pId);
			String setAttr = setParentObjAtisTC(context,args,pId,RawType,atisTargetCost);
			if(!setAttr.contains("finish")) {
				System.out.println("모개체 복합원재료만 수정되었음");
			}
		}
		    	
    } 
    
    
    
    public String setParentObjAtisTC(Context context,String[] args, String parentId
    		,String RawType, String atisTargetCost) throws Exception{
    	
//    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
//    	HashMap requestMap = (HashMap) programMap.get("requestMap");
//    	HashMap paramMap = (HashMap) programMap.get("paramMap");
//    	String relId = (String) paramMap.get("relId");
    	
    	String relName = "Formula Ingredient";
    	String clear = "Finish";
    	String type_RawMaterial="";
    	//String relationship_formula_name = relName;
    	DomainObject pDom = new DomainObject(parentId);
    	//DomainRelationship pRel = new DomainRelationship(relId);
    	String domType = pDom.getType(context);
    	if(domType.equals("Raw Material")) {
    		relName = "EBOM";
    		clear = "Raw Material.. 상위개체 변경 필요함.";
    	}
    	StringList busSelects = new StringList();
		busSelects.add(DomainConstants.SELECT_ID);
		busSelects.add(DomainConstants.SELECT_NAME);
		StringList relSelects = new StringList();
		relSelects.add(DomainConstants.SELECT_RELATIONSHIP_ID);
		
		MapList RawMap = pDom.getRelatedObjects(context,
				relName,//rel_name
				RawType, //to_type
				busSelects, // obj_select
				relSelects, // rel_select
				false, // to로부터 찾냐.
				true,//from에서부터 찾냐.
				(short) 1, // 몇래밸
				null, //오브젝트 조건
				null);
		
		System.out.println("맵리스팅완료");
		double wSum = 0.0;
		double w = 0.0;
		for( Object o : RawMap) {
			Map rawMap = (Map) o;
			String rId = (String) rawMap.get("id[connection]");
			String oId = (String) rawMap.get("id");
			
			DomainObject oIdDom = new DomainObject(oId);
			MapList oMap = oIdDom.getRelatedObjects(context,
					"EBOM",//rel_name
					RawType, //to_type
					busSelects, // obj_select
					relSelects, // rel_select
					false, // to로부터 찾냐.
					true,//from에서부터 찾냐.
					(short) 1, // 몇래밸
					null, //오브젝트 조건
					null);
			if(oMap.size()>0) {
				w = Double.parseDouble(oIdDom.getAttributeValue(context, "atis Target Cost"));
			}else {
				DomainRelationship rIdDom = new DomainRelationship(rId);
				w = Double.parseDouble(rIdDom.getAttributeValue(context, "atis Target Cost"));
			}
			wSum += w;
			
		}
		System.out.println("저장되어야할 총 가격:"+wSum);
		//String Sum = Double.toString(wSum);
		pDom.setAttributeValue(context, atisTargetCost, Double.toString(wSum));

		System.out.println("저장된 총 가격:"+pDom.getAttributeValue(context, "atis Target Cost"));
		//System.out.println("저장된 총 무게:"+pRel.getAttributeValue(context, "atisWeight"));
    	
		return clear;
    }
    
    
public Vector getAtisProportion(Context context, String[] args) throws Exception{
    	
    	Vector vec = new Vector();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
    	MapList objList = (MapList) programMap.get("objectList");
    	HashMap paramList = (HashMap) programMap.get("paramList");
    	
    	String parentOID = (String) paramList.get("parentOID");
    	DomainObject parentDom = new DomainObject(parentOID);
    	String formulWeight = parentDom.getAttributeValue(context, "atisWeight");
    	String value ="";
    	String atisWeight ="";
    	String trueChild = "true";
    	Double dRM = 0.0;
    	Double dFW = Double.parseDouble(formulWeight); 
    	
    	
    	for(Object o : objList) {
    		
    		Map rawMap = (Map) o;
    		String objId = (String) rawMap.get("id");
    		String relId = (String) rawMap.get("id[connection]");
    		String level = (String) rawMap.get("level");
    		String hasChildren = (String) rawMap.get("hasChildren");
    		try{
	    		if(!level.equals("0")) {
		    		DomainRelationship rDom = new DomainRelationship(relId);
		    		atisWeight = rDom.getAttributeValue(context, "atisWeight");
		    		dRM = Double.parseDouble(atisWeight);
		    		value =(Double.toString((dRM/dFW)*100));
		    		//System.out.println("atisProp:"+value);
		    		
		    		if(hasChildren.equals(trueChild)) {
		    			DomainObject oDom = new DomainObject(objId);
			    		atisWeight = oDom.getAttributeValue(context, "atisWeight");
			    		dRM = Double.parseDouble(atisWeight);
			    		value =(Double.toString((dRM/dFW)*100));
			    		//System.out.println("atisProp:"+value);
		    		}
		    		vec.add(value);
	    		}else {
		    		vec.add("100");
	    		}
	    	}catch(Exception e) {
				System.out.println("atisWeight:" + value);
				vec.add(value);
			}
    	}
     	
    	
    	return vec;
    }



	// 중복오브젝트 추가 방지 하기 위한 method
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public static Object excludeFormulaRelatedObjects(Context context, String[] args ) throws Exception
	{
		StringList excludeOID = new StringList();
		try
		{
			HashMap paramMap = (HashMap)JPO.unpackArgs(args);
			String objectId = (String)paramMap.get("objectId");
			String strRelationship = (String)paramMap.get("srcDestRelName");
			String strFieldtype = (String)paramMap.get("field_actual");
			DomainObject dom = new DomainObject(objectId);
			StringList busSelects = new StringList();
			busSelects.add(DomainConstants.SELECT_ID);
			busSelects.add(DomainConstants.SELECT_NAME);
			StringList relSelects = new StringList();
			relSelects.add(DomainConstants.SELECT_RELATIONSHIP_ID);
			String exid ="";
			MapList mapList = dom.getRelatedObjects(context,
					"Formula Ingredient",//rel_name
					"Raw Material", //to_type
					busSelects, // obj_select
					relSelects, // rel_select
					false, // to로부터 찾냐.
					true,//from에서부터 찾냐.
					(short) 1, // 몇래밸
					null, //오브젝트 조건
					null);
			for(Object o : mapList) {
				Map map = (Map) o;
				exid = (String) map.get("id");
				DomainObject dom2 = new DomainObject(exid);
				System.out.println("제외 id:"+exid+", name:"+dom2.getName(context));
				excludeOID.add(exid);
			}
  			
			return excludeOID;
		}
		catch (Exception ex)
		{

			throw ex;
		}
	}
	
	// 중복오브젝트 추가 방지 하기 위한 method
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public static Object includeRelatedPerson(Context context, String[] args ) throws Exception
	{
		StringList excludeOID = new StringList();
		try
		{
			HashMap paramMap = (HashMap)JPO.unpackArgs(args);
			String objectId = (String)paramMap.get("objectId");
			String strRelationship = (String)paramMap.get("srcDestRelName");
			String strFieldtype = (String)paramMap.get("field_actual");
			DomainObject dom = new DomainObject(objectId);
			StringList busSelects = new StringList();
			busSelects.add(DomainConstants.SELECT_ID);
			busSelects.add(DomainConstants.SELECT_NAME);
			StringList relSelects = new StringList();
			relSelects.add(DomainConstants.SELECT_RELATIONSHIP_ID);
			String exid ="";
			MapList mapList = dom.getRelatedObjects(context,
					"Member",//rel_name
					"Person", //to_type
					busSelects, // obj_select
					relSelects, // rel_select
					false, // to로부터 찾냐.
					true,//from에서부터 찾냐.
					(short) 0, // 몇래밸
					null, //오브젝트 조건
					null);
			for(Object o : mapList) {
				Map map = (Map) o;
				exid = (String) map.get("id");
				DomainObject dom2 = new DomainObject(exid);
				System.out.println("제외 id:"+exid+", name:"+dom2.getName(context));
				excludeOID.add(exid);
			}
  			
			return excludeOID;
		}
		catch (Exception ex)
		{

			throw ex;
		}
	}
	
	
	public static void testJPO(Context context, String[] args ) throws Exception
	{
		System.out.println("post [S]")
		;
		HashMap programMap = (HashMap)JPO.unpackArgs(args);
		HashMap requestMap = (HashMap) programMap.get("requestMap");
		String PreAssigneeOID = (String) requestMap.get("PreAssigneeOID");
		String AssigneeOID = (String) requestMap.get("AssigneeOID");
		String PreAssignee = (String) requestMap.get("PreAssignee");
		String Assignee = (String) requestMap.get("Assignee");
		// step 1 : pre-assignee. getTask.
		
		String objectId = (String)requestMap.get("parentOID");

		DomainObject dom = new DomainObject(objectId); // project
		StringList busSelects = new StringList();
		busSelects.add(DomainConstants.SELECT_ID);
		busSelects.add(DomainConstants.SELECT_NAME);
		busSelects.add(DomainConstants.SELECT_CURRENT);
		StringList relSelects = new StringList();
		relSelects.add(DomainConstants.SELECT_RELATIONSHIP_ID);
		String palId ="";
		MapList mapList = dom.getRelatedObjects(context,
				"Project Access List",//rel_name
				"*", //to_type
				busSelects, // obj_select
				relSelects, // rel_select
				true, // to로부터 찾냐.
				false,//from에서부터 찾냐.
				(short) 0, // 몇래밸
				null,
				null);
//		MapList mapList = dom.getRelatedObjects(context,
//				"Subtask",//rel_name
//				"*", //to_type
//				busSelects, // obj_select
//				relSelects, // rel_select
//				false, // to로부터 찾냐.
//				true,//from에서부터 찾냐.
//				(short) 0, // 몇래밸
//				"",
//				"relationship[Assigned Tasks].from.name=='"+PreAssignee+"'] || from[Subtask].to.from[Subtask].to.to[Assigned Tasks].from.name=='"+PreAssignee+"'", //오브젝트 조건
//				null,
//				null,
//				null);
		System.out.println(PreAssignee);
		for(Object o : mapList) {
			Map map = (Map) o;
			palId = (String) map.get("id");
			DomainObject dom2 = new DomainObject(palId);
			MapList taskList = dom2.getRelatedObjects(context,
					"Project Access Key",//rel_name
					"*", //to_type
					busSelects, // obj_select
					relSelects, // rel_select
					false, // to로부터 찾냐.
					true,//from에서부터 찾냐.
					(short) 0, // 몇래밸
					"to[Assigned Tasks].from.name=='"+PreAssignee+"'",
					null);
			
			for(Object o2 : taskList) {
				Map map2 = (Map) o2;
				String taskId = (String) map2.get("id"); // 연결해줘야할 task의 id
				String current = (String) map2.get("current");
				DomainObject dom3 = new DomainObject(taskId);
				String dom3Name = dom3.getName(context);
				String dom3RelId = dom3.getInfo(context,"to[Assigned Tasks].id");
				System.out.println("처리하고자하는 태스크 이름:"+dom3Name+", id:"+taskId+", Rel Id:"+dom3RelId);
				
				if(!current.equals("Complete")) {
					//새로연결
					DomainRelationship.connect(context,
							new DomainObject(AssigneeOID),
							"Assigned Tasks",
							new DomainObject(taskId));
					//기존연결삭제
					DomainRelationship.disconnect(context, dom3RelId);
				}
				
				
			}
		}
		
		
		System.out.println("post [E]");
	}
}//end of class
