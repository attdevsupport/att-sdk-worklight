package com.att;

public class ATTConstant
{
	public static final String ARG_FILEOBJECT = "fileObject";
	public static final String ARG_HEADER_ACCEPT = "accept";
	public static final String ARG_BODY="body";
	public static final String ARG_HEADER_CONTENT_TYPE = "contentType";
	public static final String ARG_HEADER_CONTENT_LENGTH = "headerContentLength";
	public static final String ARG_HEADER_CONTENT_LANGUAGE = "contentLanguage";
	public static final String ARG_HEADER_XSPEECH_CONTEXT = "xSpeechContext";
	public static final String ARG_HEADER_XSPEECH_SUBCONTEXT = "xSpeechSubContext";
	public static final String ARG_HEADER_TRANSFER_ENCODING = "headerTransferEncoding";
	public static final String ARG_HEADER_XARG = "xArg";
	public static final String VAL_TRANSFER_ENCODING_CHUNKED = "chunked";
	public static final String ARG_URL = "host";
	public static final String VAL_CONTENT_TYPE_WAV = "audio/wav";
	public static final String VAL_CONTENT_TYPE_AMR = "audio/amr";
	public static final String VAL_CONTENT_TYPE_AMRWB = "audio/amr-wb";
	public static final String VAL_EN_US = "en-US";
	
	public static final String ERR_INV_ACT_CODE = "PLAT001";
	public static final String ERR_INV_ACT_MSG = "Invalid Action Provided";
	public static final String ARG_TOKEN = "accessToken";
	public static final String ERR_INV_PARAM_CODE = "PLAT002";
	public static final String ERR_INV_PARAM_MSG = "Invalid Parameters Provided";
	public static final String ARG_FILEPATH = "filePath";
	public static final String ERR_INV_PROCESS_CODE = "PLAT003";
	public static final String ERR_INV_PROCESS_MSG = "Processing error occured";

	public static final String ERR_FILE_NA_CODE = "PLAT004";
	public static final String ERR_FILE_NA_MSG = "File not found";

	public static final String ERR_PROCESS_AUDIO_CODE = "PLAT005";
	public static final String ERR_PROCESS_AUDIO_MSG = "Unable to process audio file";

	public static final String ERR_INV_STATUS_CODE = "PLAT006";
	public static final String ERR_INV_STATUS_MSG = "Status Code not 200/201";

	public static final String ERR_PROCESS_REQ_CODE = "PLAT007";
	public static final String ERR_PROCESS_REQ_MSG = "Error while executing request";
}