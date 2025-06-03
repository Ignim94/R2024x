//define(
//		'DS/SpecRawMaterial/utils/RawMaterialJsonUtils',
//		[ 'UWA/Class', 'DS/TreeModel/TreeDocument', 'DS/TreeModel/TreeNodeModel', ],
//		function(Class, TreeDocument, TreeNodeModel) {
//
//			"use strict";
//
//			var rawMaterialJsonUtils = Class
//					.extend({
//
//						classificationFieldArray : [],
//						classificationTreeModel : new TreeDocument(),
//						rmAttributes : ["Raw_Material.RawMaterialCategory","Raw_Material.RawMaterialForm"],
//
//						init : function() {
//						},
//
//						// Setters
//
//						setClassificationTreeModel : function(json) {
//							var that = this;
//							var createNode = function(label, value) {
//								var node = new TreeNodeModel({
//									label : label,
//									value : value
//								});
//								return node;
//							};
//							that.classificationFieldArray = [];
//							let classStack = [];
//							let iterate = function(json) {
//								Object
//										.keys(json)
//										.forEach(
//												function(key) {
//													let dbName = json[key].indentifier.dbName;
//													let nlsLabel = json[key].indentifier.nlsLabel;
//													if (that.isNonNlsLabel(nlsLabel))
//														nlsLabel = dbName;
//
//													let root = createNode(nlsLabel,
//															dbName);
//													let data = {
//														'root' : root,
//														'name' : dbName
//													}
//
//													that
//															.setClassificationFieldArray(
//																	json[key].attributeList,
//																	dbName, nlsLabel);
//													if (json[key].subInterfaceList
//															&& json[key].subInterfaceList.length > 0) {
//														classStack.push(data);
//
//														iterate(json[key].subInterfaceList);
//
//														let tempChild = classStack
//																.pop();
//														if (classStack.length == 0) {
//															that.classificationTreeModel
//																	.addRoot(tempChild.root);
//														} else {
//															let tempRoot = classStack[classStack.length - 1].root;
//															tempRoot
//																	.addRoot(tempChild.root);
//														}
//													} else {
//														if (classStack.length == 0) {
//															that.classificationTreeModel
//																	.addRoot(root);
//														} else {
//															let tempRoot = classStack[classStack.length - 1].root;
//															tempRoot
//																	.addRoot(root);
//														}
//													}
//												});
//							};
//							if (classStack.length != 0) {
//								console.warn("Class Stack not empty!!");
//							}
//
//							// Start a transaction
//							that.classificationTreeModel.prepareUpdate();
//							that.classificationTreeModel.empty();
//
//							iterate(json);
//
//							that.classificationTreeModel.pushUpdate();
//
//						},
//
//						setClassificationFieldArray : function(attributeList,
//								dbName, nlsLabel) {
//							var that = this;
//							let fieldsInfo = [];
//							Object
//									.keys(attributeList)
//									.forEach(
//											function(key) {
//												fieldsInfo
//														.push({
//															"name" : attributeList[key].indentifier.dbName,
//															"label" : attributeList[key].indentifier.nlsLabel,
//															"ismandatory" : false,
//															"placeholder" : null,
//															"disabled" : false,
//															"clearIcon" : true,
//															"type" : attributeList[key].type,
//															"visible" : true
//														});
//												that.rmAttributes.push(attributeList[key].indentifier.dbName);
//											});
//							let group = {
//								"groupName" : dbName,
//								"groupLabel" : nlsLabel,
//								"visible" : false,
//								"fieldsInfo" : fieldsInfo
//							};
//
//							this.classificationFieldArray.push(group);
//							
//						},
//
//						// Getters
//						getClassificationTreeModel : function() {
//							return this.classificationTreeModel;
//						},
//						getClassificationFieldArray : function() {
//							return this.classificationFieldArray;
//						},
//						getRmAttributes : function(){
//							return this.rmAttributes;
//						},
//						isNonNlsLabel : function(label) {
//							if (label.includes("emxFramework.")) {
//								return true;
//							}
//							return false;
//						}
//
//					});
//
//			return rawMaterialJsonUtils;
//		});
