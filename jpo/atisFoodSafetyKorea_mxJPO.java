import com.atis.atisFoodSafetyKoreaService;
import matrix.db.Context;


public class atisFoodSafetyKorea_mxJPO {
    /**
     * 식품 안전 나라 Interface Program
     *
     * @param context
     * @param args
     * @return
     * @throws Exception
     */
    public int mxMain(Context context, String[] args) throws Exception {
    /*
        args[0] : 인터페이스 대상
            - All :전체
            - FoodType : 식품유형
            - CommonStd : 공통기준종류
            - TestItem : 시험항목
            - I_Spec : 개별규격
            - C_Spec : 공통규격
        args[1] : I/F 대상 날짜 지정
            - 공백 : 전체 데이터
            - 20221202 : 대상날짜의 업데이트 데이터 (형식 | YYYYMMDD)
        args[2] : I/F 데이터 개수 지정
        args[3] : GET DATA Start Sequence 
        args[4] : GET DATA End Sequence

        Ex>
            execute program atisFoodSafetyKorea '' '' 0;
            execute program atisFoodSafetyKorea 'FoodType' '' '';
            execute program atisFoodSafetyKorea 'CommonStd' '';
            execute program atisFoodSafetyKorea 'TestItem' '';
            execute program atisFoodSafetyKorea 'I_Spec' '';
            execute program atisFoodSafetyKorea 'C_Spec' '';
            execute program atisFoodSafetyKorea 'RM' '';
       Desc : 식품유형의 건강식품 항목의 하위 품목들은 품목명에 '(건)' 표시
              추후 데이터 업데이트 및 코드가 변경될 시 수동으로 변경해야 함.
              
              set context user creator; verb on; trigger on; execute program atisFoodSafetyKorea 'RM' '';
    */

        String sTarget = "";
        String sTargetDate = "";
        int runCount = 0;
        
        int startSeq = 0;
        int endSeq = 0;

        if (args != null && args.length > 0) {
            sTarget = NVL(args[0]);
            sTargetDate = NVL(args.length > 1 ? args[1] : "");

            String sCount = args.length > 2 ? args[2] : "0";
            runCount = isNumeric(sCount) ? Integer.valueOf(sCount) : 0;
            
//            String sStartSeq = args.length > 2 ? args[2] : "0";
//            startSeq = isNumeric(sStartSeq) ? Integer.valueOf(sStartSeq) : 0;
//            
//            String sEndSeq = args.length > 2 ? args[2] : "0";
//            endSeq = isNumeric(sEndSeq) ? Integer.valueOf(sEndSeq) : 0;
        }

        atisFoodSafetyKoreaService service = new atisFoodSafetyKoreaService(context);
        if (sTargetDate.length() > 0) service.setTargetDate(sTargetDate);
        if (runCount > 0) service.setRunCount(runCount);
//        if (startSeq > 0) service.setStartSeq(startSeq);
//        if (endSeq > 0) service.setEndSeq(endSeq);


        if (sTarget.length() == 0) service.runBatch(); // 전체

        else if (sTarget.equals("FoodType")) service.runFoodTypeBatch(); // 품목

        else if (sTarget.equals("CommonStd")) service.runCommonStdTypeBatch(); // 공통기준종류

        else if (sTarget.equals("TestItem")) service.runTestItemBatch(); // 시험항목

        else if (sTarget.equals("I_Spec")) service.runIndividualStandardSpecBatch(); // 시험항목

        else if (sTarget.equals("C_Spec")) service.runCommonStandardSpecBatch(); // 시험항목
        
        else if (sTarget.equals("RM")) service.runRawMaterialListBatch(); // 식품원재료코드
        
        else if (sTarget.equals("jsonFileExport")) {

        }
        return 0;
    }


    public static String NVL(Object pParam) {
        return NVL(pParam, "");

    }

    /**
     * String을 Empty 처리를 한다.
     * null일경우는 strDefaultValue를 리턴하고, 그렇지 않을 경우는 양쪽 스페이스를 없애고 리턴한다.
     *
     * @param pParam          object
     * @param strDefaultValue pParam이 null일시 대체될 값
     * @return String 원본 String가 null일 경우 "" 그렇지 않을 경우 trim 된 String
     */
    public static String NVL(Object pParam, String strDefaultValue) {
        String ret = "";


        if (pParam != null) {
            if (pParam instanceof String) {
                ret = (String) pParam;
            } else {
                ret = pParam.toString();
            }

            ret = ret.trim();
            if (atisFoodSafetyKoreaService.isEmpty(ret)) {
                ret = strDefaultValue;
            }
        } else {
            ret = strDefaultValue;
        }
        return ret;
    }

    public static boolean isNumeric(String str) {
        return NVL(str).length() == 0 ? false : NVL(str).chars().allMatch(Character::isDigit);
    }

}
