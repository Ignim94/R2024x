import matrix.db.Context;

import com.dassault_systemes.enovia.characteristic.impl.CharacteristicServices;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicServices;


public class ENOCharacteristicCateogryRangeBase_mxJPO {

	/**
	 *
	 * @param context the eMatrix <code>Context</code> object
	 * @param args holds no arguments
	 * @throws Exception if the operation fails
	 * @version Common 10.5.1.2
	 * @grade 0
	 */
	public ENOCharacteristicCateogryRangeBase_mxJPO (Context context, String[] args)
			throws Exception
	{
	}

	// to display category ranges for category field
	public String mxMain(Context context, String[] args) throws Exception
	{

		String categoryRanges = "";
		try {
			categoryRanges = ENOCharacteristicServices.getCategoryRanges(context, true);
		}
		catch (Exception e) {
			throw e;
		}
		return categoryRanges;
	}

}
