import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.dassault_systemes.enovia.workspace.modeler.WorkspaceMdlUtil;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;

import matrix.db.Context;
import matrix.util.StringList;

public class emxWorkspaceMdlSystemUtil_mxJPO extends emxDomainObject_mxJPO {
    
    private final String SELECT_ATTRIBUTE_COUNT = getAttributeSelect(ATTRIBUTE_COUNT);
    
    //to ensure data retrieved from RPE variable only once 
    private int _contentCount =0;
    
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    public emxWorkspaceMdlSystemUtil_mxJPO(Context context, String[] args) throws Exception {
        super(context, args);
    }
    
    /**
     * Update the count attribute of bookmark for different use cases as required.
     * 
     * @param context the eMatrix Context object
     * @param args history records of bookmark.
     * @since R2022x FD01
     *        R2022x FD04 The algorithm to update Count is changed to improve efficiency.
     *        R2024x GA   The algorithm to update Count is further changed to incorporate
     *                    Bookmark DELETE and MOVE use cases. With this change CREATE/DELETE
     *                    Action trigger on Sub Vaults relationship will send value of count
     *                    by which the value of Count attribute will be updated for bookmarks.
     * @exception Exception if operation fails.
     */
    public void updateCountOnTransaction(Context context, String[] args) throws Exception {
        String transactionHistory = args[0];
        //System.out.println("BOOKMARK UPDATE COUNT :\n" + transactionHistory);
        String[] transactionRecords = transactionHistory.split("\n");
        
        //Cache to be used to keep track of content count
        Map<String, Integer> contentCountCache = new HashMap<>();
        
        //Data Structure used to hold bookmarkIds and their Mapping with corresponding operation.
        Set<String> disconnectOpBookmarks = new HashSet<>();
        Set<String> connectOpBookmarks = new HashSet<>();
        Map<String, Object> bookmarkOperationMap = new HashMap<>();
        
        String bookmarkId = null;
        int count =0;
        
        /*
         * Load :
         * - Cache with all the bookmarks (ID) involved in transaction with the number of content added/removed.
         *      OR
         * - Map with bookmark operation with the bookmarkIds on which operation performed.
         */
        for (String record : transactionRecords) {
            if (record.startsWith("id=")) {
                if (bookmarkId!=null && count!=0) {
                    contentCountCache.put(bookmarkId, count);
                    count=0;
                }
                bookmarkId = record.substring("id=".length());
            } else {
                //Update Count when Content is involved in Transaction.
                if (record.contains("disconnect Vaulted Objects to")) {
                    count--;
                } else if (record.contains("connect Vaulted Objects to")) {
                    count++;
                }
                
                //Below conditions is to update Count when subBookmark is DELETED or MOVED.
                
                /*
                 * Either subBookmark is DELETED OR MOVED from Source (Bookmark is disconnected).
                 * Both Use Cases needs to be covered. 
                 */
                else if (record.contains("disconnect Sub Vaults to")) {
                    disconnectOpBookmarks.add(bookmarkId);
                    bookmarkOperationMap.put( "D", disconnectOpBookmarks);
                }
                
                /*
                 * Either subBookmark is CREATED OR MOVED to Destination (bookmark is connected).
                 * MOVE needs to be covered.
                 */
                else if (record.contains("connect Sub Vaults to") && !record.contains("history added to identify actual user")) {
                    connectOpBookmarks.add(bookmarkId);
                    bookmarkOperationMap.put("C", connectOpBookmarks);
                }
            }
        }
        
        if (count!=0) {
            contentCountCache.put(bookmarkId, count);
        }
        
        /*
         * Update Count attribute when content is involved in transaction.
         */
        if (!contentCountCache.isEmpty()) {
            updateContentCount(context, contentCountCache);
        }
        /*
         * Update Count if operation Map is not empty. It can have
         * - DISCONNECT subBookmark "D"
         * - CONNECT subBookmark "C"
         * - OR Both
         */
        else if (!bookmarkOperationMap.isEmpty()) {
            updateCountOnBookmarkOperation(context, bookmarkOperationMap);
        }
    }
    
    /**
     * Update Count attribute when content is directly involved in a transaction
     * 
     * @param context the eMatrix Context object.
     * @param contentCountCache Map containing Count against a given bookmarkId.
     * @throws Exception if operation fails.
     * @since R2024x GA to make updateCountOnTransaction() method look clean.
     */
    private void updateContentCount(Context context, Map<String, Integer> contentCountCache) throws Exception {
        Set<String> bookmarkIdSet = contentCountCache.keySet();
        String[] objectIds = bookmarkIdSet.toArray(new String[bookmarkIdSet.size()]);
        
        //objectSelects required to get the existing Count values
        StringList objectSelects = new StringList();
        objectSelects.add(SELECT_ID);
        objectSelects.add(SELECT_ATTRIBUTE_COUNT);
        
        //Single DB call to retrieve existing value of Count attribute for all bookmarks involved in transaction
        MapList bookmarkContentCount = DomainObject.getInfo(context, objectIds, objectSelects);
        
        //A temporary cache is required to retrieve the Number of content objects added/removed to bookmarks [COPY scenario]
        Map<String, Integer> tempCache = new HashMap<>(contentCountCache);
        
        //Update Cache with all the bookmarks in the hierarchy
        int count =0;
        String bookmarkId = null;
        for (int i=0;i<bookmarkContentCount.size();i++) {
            Map<?,?> bookmarkMap = (Map<?,?>)bookmarkContentCount.get(i);
            bookmarkId = (String)bookmarkMap.get(SELECT_ID);
            //Update bookmarks in Cache with 'existing count value' + 'number of content objects added/removed in given transaction'
            contentCountCache.put(bookmarkId,  contentCountCache.get(bookmarkId) +
                                               Integer.parseInt((String)bookmarkMap.get(SELECT_ATTRIBUTE_COUNT)));
            
            DomainObject bookmark = new DomainObject(bookmarkId);
            MapList parentBookmarksList = bookmark.getRelatedObjects(context,
                                                                     RELATIONSHIP_SUB_VAULTS,
                                                                     TYPE_WORKSPACE_VAULT,
                                                                     objectSelects,
                                                                     null,
                                                                     true,
                                                                     false,
                                                                     (short)0,
                                                                     null,
                                                                     null,
                                                                     0, null, null, null);
            String parentBookmarkId =null;
            count = tempCache.get(bookmarkId);
            for (int j=0;j<parentBookmarksList.size();j++) {
                Map<?,?> parentBookmarkMap = (Map<?,?>)parentBookmarksList.get(j);
                parentBookmarkId = (String)parentBookmarkMap.get(SELECT_ID);
                if (contentCountCache.containsKey(parentBookmarkId)) {
                    contentCountCache.put(parentBookmarkId, contentCountCache.get(parentBookmarkId) + count);
                } else {
                    contentCountCache.put(parentBookmarkId, Integer.parseInt((String)parentBookmarkMap.get(SELECT_ATTRIBUTE_COUNT)) + count);
                }
            }
        }
        
        //Update Count of all bookmarks from the Cache
        bookmarkIdSet = contentCountCache.keySet();
        DomainObject bookmark = null;
        for (String id : bookmarkIdSet) {
            bookmark = new DomainObject(id);
            count = contentCountCache.get(id);
            bookmark.setAttributeValue(context, ATTRIBUTE_COUNT, String.valueOf(count));
        }
    }
    
    /**
     * Update Count attribute when bookmark is MOVED or DELETED.
     * 
     * @param context the eMatrix Context object
     * @param bookmarkOperationMap Map contains bookmark connect/disconnect operations
     *                             mapped to the bookmark id on which operation happened
     *                             Below are the Keys:
     *                              C  : Sub Vaults connect happens
     *                              D  : Sub Vaults disconnect happens
     * @throws Exception if operation fails
     * @since 2024x GA, to update Count in transaction trigger when Bookmak is DELETED or MOVED
     * SuppressWarnings is added as it is guaranteed that Set<String> will be returned.
     */
    @SuppressWarnings("unchecked")
    private void updateCountOnBookmarkOperation(Context context, Map<String, Object> bookmarkOperationMap) throws Exception {
        //variables required
        DomainObject bookmark = new DomainObject();
        Map<?,?> map = null;
        Set<String> operatingBookmarkIds = null;
        MapList parentBookmarksList = null;
        
        //Map used to store Count of all required bookmarks
        Map<String, Integer> bookmarkCountUpdate = new HashMap<>();
        
        //objectSelects required to get the existing Count values
        StringList objectSelects = new StringList();
        objectSelects.add(SELECT_ID);
        objectSelects.add(SELECT_ATTRIBUTE_COUNT);
        
        /*
         * Step 1 : Get existing Count value of Source bookmark (from which subBookmark is disconnected)
         *          and its parent bookmark and put them in Map with updated value of Count.
         */
        int existingCount = 0;
        int countChangedBy =0;
        String resetBookmarkId = null;
        if (bookmarkOperationMap.containsKey("D")) {
            operatingBookmarkIds = (Set<String>)bookmarkOperationMap.get("D");
            for (String bookmarkId : operatingBookmarkIds) {
                bookmark.setId(bookmarkId);
                existingCount = Integer.parseInt(bookmark.getInfo(context, SELECT_ATTRIBUTE_COUNT));
                countChangedBy = Integer.parseInt(PropertyUtil.getRPEValue(context, "BOOKMARK_DECREMENT_COUNT_" + bookmarkId, true));
                bookmarkCountUpdate.put(bookmarkId, existingCount - countChangedBy);
                resetBookmarkId = bookmarkId;
                
                parentBookmarksList = bookmark.getRelatedObjects(context,
                                                                 RELATIONSHIP_SUB_VAULTS,
                                                                 TYPE_WORKSPACE_VAULT,
                                                                 objectSelects,
                                                                 null,
                                                                 true,
                                                                 false,
                                                                 (short)0,
                                                                 null,
                                                                 null,
                                                                 0, null, null, null);
                for (int i=0; i<parentBookmarksList.size(); i++) {
                    map = (Map<?,?>)parentBookmarksList.get(i);
                    bookmarkId = (String)map.get(SELECT_ID);
                    existingCount = Integer.parseInt((String)map.get(SELECT_ATTRIBUTE_COUNT));
                    if (bookmarkCountUpdate.containsKey(bookmarkId)) {
                        bookmarkCountUpdate.put(bookmarkId, bookmarkCountUpdate.get(bookmarkId) - countChangedBy);
                    } else {
                        bookmarkCountUpdate.put(bookmarkId, existingCount - countChangedBy);
                    }
                }
                PropertyUtil.unsetRPEValue(context, "BOOKMARK_DECREMENT_COUNT_" + resetBookmarkId, true);
            }
        }
        
        /*
         * Step 2 : Get existing Count value of Destination bookmark (on which subBookmark is connected)
         *          and its parent bookmark and put them in Map with updated value of Count.
         */
        if (bookmarkOperationMap.containsKey("C")) {
            operatingBookmarkIds = (Set<String>)bookmarkOperationMap.get("C");
            for (String bookmarkId : operatingBookmarkIds) {
                bookmark.setId(bookmarkId);
                existingCount = Integer.parseInt(bookmark.getInfo(context, SELECT_ATTRIBUTE_COUNT));
                countChangedBy = Integer.parseInt(PropertyUtil.getRPEValue(context, "BOOKMARK_INCREMENT_COUNT_" + bookmarkId, true));
                bookmarkCountUpdate.put(bookmarkId, existingCount + countChangedBy);
                resetBookmarkId = bookmarkId;
                
                parentBookmarksList = bookmark.getRelatedObjects(context,
                                                                 RELATIONSHIP_SUB_VAULTS,
                                                                 TYPE_WORKSPACE_VAULT,
                                                                 objectSelects,
                                                                 null,
                                                                 true,
                                                                 false,
                                                                 (short)0,
                                                                 null,
                                                                 null,
                                                                 0, null, null, null);
                for (int i=0; i<parentBookmarksList.size(); i++) {
                    map = (Map<?,?>)parentBookmarksList.get(i);
                    bookmarkId = (String)map.get(SELECT_ID);
                    existingCount = Integer.parseInt((String)map.get(SELECT_ATTRIBUTE_COUNT));
                    if (bookmarkCountUpdate.containsKey(bookmarkId)) {
                        bookmarkCountUpdate.put(bookmarkId, bookmarkCountUpdate.get(bookmarkId) + countChangedBy);
                    } else {
                        bookmarkCountUpdate.put(bookmarkId, existingCount + countChangedBy);
                    }
                }
                PropertyUtil.unsetRPEValue(context, "BOOKMARK_INCREMENT_COUNT_" + resetBookmarkId, true);
            }
        }
        
        /*
         * Step 3 : Update Count of all required bookmarks.
         */
        Set<String> bookmarkIdSet = bookmarkCountUpdate.keySet();
        for (String bookmarkId : bookmarkIdSet) {
            bookmark.setId(bookmarkId);
            countChangedBy = bookmarkCountUpdate.get(bookmarkId);
            bookmark.setAttributeValue(context, ATTRIBUTE_COUNT, String.valueOf(countChangedBy));
        }
    }
    
    /**
     * Publishes message when content is attached to/detached from bookmark
     * 
     * @param context the eMatrix Context object
     * @param args contains history records of objects in current transaction.
     * @since R2023x FD02
     */
    public void sendAttachDetachEventMessage(Context context, String[] args) {
        try {
            String transactionHistory = args[0];
            //System.out.println("BOOKMARK RAISE EVENTS :\n" + transactionHistory);
            String[] transactionRecords = transactionHistory.split("\n");
            
            //Check if connect/disconnect event actually happens
            boolean isEventRequired = false;
            for (String record : transactionRecords) {
                if (record.contains("disconnect Vaulted Objects to") || record.contains("connect Vaulted Objects to")) {
                    isEventRequired = true;
                    break;
                }
            }
            
            if (isEventRequired) {
                WorkspaceMdlUtil workspaceMdl = WorkspaceMdlUtil.newInstance();
                
                //object selectAbles
                StringList objectSelects = new StringList();
                objectSelects.add(SELECT_NAME);
                objectSelects.add(SELECT_TYPE);
                objectSelects.add(SELECT_PHYSICAL_ID);
                objectSelects.add("type.property[PublicResourceURI].value");
                
                //relationship selectAbles
                StringList relationshipSelects = new StringList();
                relationshipSelects.add("from.type");
                relationshipSelects.add("from.physicalid");
                
                MapList bookmarkContent = null;
                String bookmarkId = null;
                DomainObject bookmark = new DomainObject();
                for (String record : transactionRecords) {
                    if (record.startsWith("id=")) {
                        bookmarkId = record.substring("id=".length());
                        
                        //Get details from this object
                        bookmark.setId(bookmarkId);
                        
                        //Get all the details in one DB call
                        bookmarkContent = bookmark.getRelatedObjects(context,
                                                                     RELATIONSHIP_VAULTED_OBJECTS,
                                                                     QUERY_WILDCARD,
                                                                     objectSelects,
                                                                     relationshipSelects,
                                                                     false,
                                                                     true,
                                                                     (short) 1,
                                                                     null,
                                                                     null,
                                                                     0,
                                                                     null,
                                                                     null,
                                                                     null);
                        
                        _contentCount = bookmarkContent.size();
                    } else {
                        if (record.contains("disconnect Vaulted Objects to")) {  //detach event occurred
                            workspaceMdl.sendEventMessage(context, bookmarkContent, record, "detach", _contentCount);
                        } else if (record.contains("connect Vaulted Objects to")) {  //attach event occurred
                            workspaceMdl.sendEventMessage(context, bookmarkContent, record, "attach", _contentCount);
                        }
                    }
                }
                workspaceMdl.closeProducer();
            }
        } catch (Exception e) {
            System.out.println("Error publishing events " + e.getMessage());
            e.printStackTrace();
        }
    }
}
