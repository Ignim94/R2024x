define('DS/MePreferencesUIBuilder/MePreferencesMainView',
    [
        "DS/MePreferencesUIBuilder/MePreferencesPageView",
        "DS/Skeleton/SkeletonLayout",
        "DS/Skeleton/SkeletonUtils",
        "DS/MePreferencesUIBuilder/MePreferencesCategoryView"
    ],
    function (MePreferencesPageView, SkeletonLayout, SkeletonUtils, MePreferencesCategoryView) {

        var serviceurl = null;
        var mainDiv = createDiv("me-preference-main-view");
        var mePreferencesCategoryViewObj = new MePreferencesCategoryView();
        var adminValues = null;
        var defaultPrefValuesMap = {};
        var prefDiv = null;
        var prefDivContent = null;
        var isAdminview = false;

        var mePreferencesPageViewObj = new MePreferencesPageView();

        function createDiv(style) {
            return new UWA.createElement("div", {
                "class": style
            });
        }


        var mePreferencesMainViewObj = {

            createMainView: async function (appID, isAdminView, adminProfileValues, serviceURL) {

                adminValues = adminProfileValues;
                isAdminview = isAdminView;
                serviceurl = serviceURL;

                var categoryDiv = new UWA.Element("div", {
                    class: "child-div-left"
                });

                prefDiv = new UWA.Element("div", {
                    class: "child-div-right"
                });
                prefDivContent = new UWA.Element("div"
                );

                document.removeEventListener("nodeSelectionChange", onNodeSelectionChange, true);
                document.addEventListener("nodeSelectionChange", onNodeSelectionChange, true);

                let categorycontent = await createCategoryView();
                categorycontent.inject(categoryDiv);

                //Creating the Skeleton Layout !
                let mySkeletonlayout = new SkeletonLayout({
                    centerContainerContent: prefDiv,
                    leftContainerCollapsedFlag: false,
                    leftContainerMinWidth: 200,
                    leftContainerMaxWidth: 200,
                    identifier: "me-preference-main-skeleton-view"
                });
                mySkeletonlayout.leftContainerContent = SkeletonUtils.createSideContentWithTitleBar({
                    skeleton: mySkeletonlayout,
                    title: "",
                    close: true,
                    maximize: false,
                    content: categoryDiv
                });

                mySkeletonlayout.inject(mainDiv);

                await mePreferencesCategoryViewObj.selectAppNode(appID);

                return mainDiv;
            },

            getDefaultPrefValuesMap: function () {
                if (defaultPrefValuesMap)
                    return defaultPrefValuesMap;
            }
        }

        function addDefaultPreferenceInMap(appID, defaultPrefValuesfromPage){
            defaultPrefValuesMap[appID] = defaultPrefValuesfromPage;
        }

        async function createCategoryView() {
            let categoryViewContent = await mePreferencesCategoryViewObj.createCategoryUI();
            return categoryViewContent;
        }

        async function createPreferenceView(appID) {
            let prefDivView = createDiv("me-preference-view-visibility-" + appID);
            return await mePreferencesPageViewObj.getMePreferencePageView(serviceurl, appID, prefDivView, isAdminview, adminValues);
        }

        async function onNodeSelectionChange(e) {

            navigator.locks.request("my_resource", async (lock) => {
                // The lock has been acquired.
                await ProcessSelectionChange(e);
                // Now the lock will be released.
            });

        }

        async function ProcessSelectionChange(e) {

            prefDiv.removeAttribute("data-mep-page-view-load-done-po-use-only");
            //if view exists 
            let appID = e.detail
            let isInjected = prefDivContent.isInjected(prefDiv);

            let curElementList = document.querySelectorAll('div[class^="me-preference-view-visibility-"]');
            if (curElementList.length > 0) {
                let parent = curElementList[0].parentNode;

                for (let i = 0; i < curElementList.length; i++) {
                    parent.removeChild(curElementList[i]);
                }
            }

            prefDivContent = await createPreferenceView(appID);
            prefDivContent.inject(prefDiv);
            prefDiv.setAttribute("data-mep-page-view-load-done-po-use-only","");
            let defaultPrefValuesfromPage = mePreferencesPageViewObj.getDefaultValues();
            addDefaultPreferenceInMap(appID, defaultPrefValuesfromPage);
        }

        return mePreferencesMainViewObj;
    });
