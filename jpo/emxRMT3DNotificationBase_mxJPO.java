/*
* @quickreview  VAI1 KIE1 [12:02:2024] : IR-1226291 - CompassV2 removal of reference to variable MyApps_URL 
* @quickreview  VAI1      [19:07:2023] : IR-1139100 - Notif Client migration is mandatory on 23xFD04 - TRM
* @quickreview  VAI1 KIE1 [DD:MM:YYYY] : HL FUN103144 - TRM modeler integration to subscribe/unsubscribe
* @quickreview  VAI1 ZUD  [17:11:2021] : IR-888265 - The Move function fails in Requirements Structure Editor widget depending on the user's security context
*/

    import java.util.HashMap;
    import matrix.db.Context;
    import matrix.db.JPO;
    import matrix.db.BusinessObject;
    import matrix.util.StringList;
    import java.util.*;
    import com.matrixone.apps.domain.DomainObject;
    import com.dassault_systemes.requirements.RMT3DNotificationJSON;
    import jakarta.json.JsonObject;
    import com.dassault_systemes.i3dx.client.notifications.nomatrix.NotificationClientBasicUtil;
    import com.dassault_systemes.i3dx.client.notifications.nomatrix.NotifConf;
    import com.matrixone.apps.common.util.SubscriptionUtil;

    public class emxRMT3DNotificationBase_mxJPO {
        NotifConf notifConf = null;
            
        public  emxRMT3DNotificationBase_mxJPO (Context context, String[] args)throws Exception {
        }

        public void sendNotif(Context context, String[] args) throws Exception{

            try{
            
                if((args[8].isEmpty()) || (args[8].equals("owner") && (!args[9].equals(args[10])))){
                    
                    //Find the notification service
                    
                    String notificationUrl = get3DNotificationsURL() + "/api/notify";
                    notifConf = NotifConf.getInstance();
                    notifConf.init(notificationUrl, 10000);
                    String NOTIFICATION_ID = "eno3dnotification.subscriptions";         
                    
                    
                    if(args.length>1){                                  
                    
                        //On Revise, copy subscriptions to new reivison
                        if(args[1].equals("MajorRevision")){
                            //System.out.println("=============BEGIN COPY SUBSCRIPTIONS===========");
                            try{
                                String originID = args[0];
                                DomainObject doreq_obj = new DomainObject(originID);
                                doreq_obj.open(context);
                                matrix.db.BusinessObjectList boList = doreq_obj.getMajorRevisions(context);
                                BusinessObject lastSrcBo = (BusinessObject) boList.elementAt(boList.size() - 1);
                                String targetID = lastSrcBo.getObjectId(context);
                                SubscriptionUtil.propagateObjectSubscriptionsOnRevise(context, originID, targetID, doreq_obj.getTypeName());
                            } catch (Exception e) {
                                e.printStackTrace();
                            } finally {
                                //System.out.println("=============END COPY SUBSCRIPTIONS===========");
                            }
                        }
                        
                        RMT3DNotificationJSON notifJSONBuilder = new RMT3DNotificationJSON(context, args, NOTIFICATION_ID, "ENORERE_AP");
                        
                        JsonObject result_json = notifJSONBuilder.getJSONObject();
                
                        if(result_json!=null) {
                            try{
                                NotificationClientBasicUtil.sendNotification(notifConf, result_json.toString());
                            } catch (Exception e) {
                                e.printStackTrace();
                            }                       
                        }
                        else {
                            //System.out.println("--getJSONObject returned NULL, maybe no subscribers");
                            }
                    }
                }
            }catch (Exception e){
                e.printStackTrace();
                }           
            }
        
        /**
         * Get 3DNotification URL.
         * <p>
         * this URL is computed from REGISTRY URL.
         *
         * @param 
         * @return 3DNotification URL.
         * @throws FrameworkException if there is a framework error
         */
        private String get3DNotificationsURL() throws Exception {
            
            String url = System.getenv("NOTIFICATION_URL");
           
            if (url==null || url.isEmpty()) {
                //System.out.println("ERROR: NOTIFICATION_URL is empty, trying to build from REGISTRY_URL");
                //in cloud, the notificaiton_url is not set. fall back to building it from another
                String notifURL = System.getenv("REGISTRY_URL");
                
                //If all else fails...
                if (notifURL==null || "".equals(notifURL)) {
                    //System.out.println("ERROR: unable to locate notification service, must be in default odt environment");
                    notifURL="http://localhost";
                }
                
                notifURL = notifURL.replace("3DSpace/resources/AppsMngtRegistry", "3Dnotification");
                url = notifURL;
            }
            return url;
        }   
    }
