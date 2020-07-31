﻿
var mIOFileType = [
    { "id": 1, "type": ".323", "name": "text/h323" },
    { "id": 2, "type": ".3g2", "name": "video/3gpp2" },
    { "id": 3, "type": ".3gp", "name": "video/3gpp" },
    { "id": 4, "type": ".3gp2", "name": "video/3gpp2" },
    { "id": 5, "type": ".3gpp", "name": "video/3gpp" },
    { "id": 6, "type": ".7z", "name": "application/x-7z-compressed" },
    { "id": 7, "type": ".aa", "name": "audio/audible" },
    { "id": 8, "type": ".AAC", "name": "audio/aac" },
    { "id": 9, "type": ".aaf", "name": "application/octet-stream" },
    { "id": 10, "type": ".aax", "name": "audio/vnd.audible.aax" },
    { "id": 11, "type": ".ac3", "name": "audio/ac3" },
    { "id": 12, "type": ".aca", "name": "application/octet-stream" },
    { "id": 13, "type": ".accda", "name": "application/msaccess.addin" },
    { "id": 14, "type": ".accdb", "name": "application/msaccess" },
    { "id": 15, "type": ".accdc", "name": "application/msaccess.cab" },
    { "id": 16, "type": ".accde", "name": "application/msaccess" },
    { "id": 17, "type": ".accdr", "name": "application/msaccess.runtime" },
    { "id": 18, "type": ".accdt", "name": "application/msaccess" },
    { "id": 19, "type": ".accdw", "name": "application/msaccess.webapplication" },
    { "id": 20, "type": ".accft", "name": "application/msaccess.ftemplate" },
    { "id": 21, "type": ".acx", "name": "application/internet-property-stream" },
    { "id": 22, "type": ".AddIn", "name": "text/xml" },
    { "id": 23, "type": ".ade", "name": "application/msaccess" },
    { "id": 24, "type": ".adobebridge", "name": "application/x-bridge-url" },
    { "id": 25, "type": ".adp", "name": "application/msaccess" },
    { "id": 26, "type": ".ADT", "name": "audio/vnd.dlna.adts" },
    { "id": 27, "type": ".ADTS", "name": "audio/aac" },
    { "id": 28, "type": ".afm", "name": "application/octet-stream" },
    { "id": 29, "type": ".ai", "name": "application/postscript" },
    { "id": 30, "type": ".aif", "name": "audio/x-aiff" },
    { "id": 31, "type": ".aifc", "name": "audio/aiff" },
    { "id": 32, "type": ".aiff", "name": "audio/aiff" },
    { "id": 33, "type": ".air", "name": "application/vnd.adobe.air-application-installer-package+zip" },
    { "id": 34, "type": ".amc", "name": "application/x-mpeg" },
    { "id": 35, "type": ".application", "name": "application/x-ms-application" },
    { "id": 36, "type": ".art", "name": "image/x-jg" },
    { "id": 37, "type": ".asa", "name": "application/xml" },
    { "id": 38, "type": ".asax", "name": "application/xml" },
    { "id": 39, "type": ".ascx", "name": "application/xml" },
    { "id": 40, "type": ".asd", "name": "application/octet-stream" },
    { "id": 41, "type": ".asf", "name": "video/x-ms-asf" },
    { "id": 42, "type": ".ashx", "name": "application/xml" },
    { "id": 43, "type": ".asi", "name": "application/octet-stream" },
    { "id": 44, "type": ".asm", "name": "text/plain" },
    { "id": 45, "type": ".asmx", "name": "application/xml" },
    { "id": 46, "type": ".aspx", "name": "application/xml" },
    { "id": 47, "type": ".asr", "name": "video/x-ms-asf" },
    { "id": 48, "type": ".asx", "name": "video/x-ms-asf" },
    { "id": 49, "type": ".atom", "name": "application/atom+xml" },
    { "id": 50, "type": ".au", "name": "audio/basic" },
    { "id": 51, "type": ".avi", "name": "video/x-msvideo" },
    { "id": 52, "type": ".axs", "name": "application/olescript" },
    { "id": 53, "type": ".bas", "name": "text/plain" },
    { "id": 54, "type": ".bcpio", "name": "application/x-bcpio" },
    { "id": 55, "type": ".bin", "name": "application/octet-stream" },
    { "id": 56, "type": ".bmp", "name": "image/bmp" },
    { "id": 57, "type": ".c", "name": "text/plain" },
    { "id": 58, "type": ".cab", "name": "application/octet-stream" },
    { "id": 59, "type": ".caf", "name": "audio/x-caf" },
    { "id": 60, "type": ".calx", "name": "application/vnd.ms-office.calx" },
    { "id": 61, "type": ".cat", "name": "application/vnd.ms-pki.seccat" },
    { "id": 62, "type": ".cc", "name": "text/plain" },
    { "id": 63, "type": ".cd", "name": "text/plain" },
    { "id": 64, "type": ".cdda", "name": "audio/aiff" },
    { "id": 65, "type": ".cdf", "name": "application/x-cdf" },
    { "id": 66, "type": ".cer", "name": "application/x-x509-ca-cert" },
    { "id": 67, "type": ".chm", "name": "application/octet-stream" },
    { "id": 68, "type": ".class", "name": "application/x-java-applet" },
    { "id": 69, "type": ".clp", "name": "application/x-msclip" },
    { "id": 70, "type": ".cmx", "name": "image/x-cmx" },
    { "id": 71, "type": ".cnf", "name": "text/plain" },
    { "id": 72, "type": ".cod", "name": "image/cis-cod" },
    { "id": 73, "type": ".config", "name": "application/xml" },
    { "id": 74, "type": ".contact", "name": "text/x-ms-contact" },
    { "id": 75, "type": ".coverage", "name": "application/xml" },
    { "id": 76, "type": ".cpio", "name": "application/x-cpio" },
    { "id": 77, "type": ".cpp", "name": "text/plain" },
    { "id": 78, "type": ".crd", "name": "application/x-mscardfile" },
    { "id": 79, "type": ".crl", "name": "application/pkix-crl" },
    { "id": 80, "type": ".crt", "name": "application/x-x509-ca-cert" },
    { "id": 81, "type": ".cs", "name": "text/plain" },
    { "id": 82, "type": ".csdproj", "name": "text/plain" },
    { "id": 83, "type": ".csh", "name": "application/x-csh" },
    { "id": 84, "type": ".csproj", "name": "text/plain" },
    { "id": 85, "type": ".css", "name": "text/css" },
    { "id": 86, "type": ".csv", "name": "text/csv" },
    { "id": 87, "type": ".cur", "name": "application/octet-stream" },
    { "id": 88, "type": ".cxx", "name": "text/plain" },
    { "id": 89, "type": ".dat", "name": "application/octet-stream" },
    { "id": 90, "type": ".datasource", "name": "application/xml" },
    { "id": 91, "type": ".dbproj", "name": "text/plain" },
    { "id": 92, "type": ".dcr", "name": "application/x-director" },
    { "id": 93, "type": ".def", "name": "text/plain" },
    { "id": 94, "type": ".deploy", "name": "application/octet-stream" },
    { "id": 95, "type": ".der", "name": "application/x-x509-ca-cert" },
    { "id": 96, "type": ".dgml", "name": "application/xml" },
    { "id": 97, "type": ".dib", "name": "image/bmp" },
    { "id": 98, "type": ".dif", "name": "video/x-dv" },
    { "id": 99, "type": ".dir", "name": "application/x-director" },
    { "id": 100, "type": ".disco", "name": "text/xml" },
    { "id": 101, "type": ".dll", "name": "application/x-msdownload" },
    { "id": 102, "type": ".dll.config", "name": "text/xml" },
    { "id": 103, "type": ".dlm", "name": "text/dlm" },
    { "id": 104, "type": ".doc", "name": "application/msword" },
    { "id": 105, "type": ".docm", "name": "application/vnd.ms-word.document.macroEnabled.12" },
    { "id": 106, "type": ".docx", "name": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { "id": 107, "type": ".dot", "name": "application/msword" },
    { "id": 108, "type": ".dotm", "name": "application/vnd.ms-word.template.macroEnabled.12" },
    { "id": 109, "type": ".dotx", "name": "application/vnd.openxmlformats-officedocument.wordprocessingml.template" },
    { "id": 110, "type": ".dsp", "name": "application/octet-stream" },
    { "id": 111, "type": ".dsw", "name": "text/plain" },
    { "id": 112, "type": ".dtd", "name": "text/xml" },
    { "id": 113, "type": ".dtsConfig", "name": "text/xml" },
    { "id": 114, "type": ".dv", "name": "video/x-dv" },
    { "id": 115, "type": ".dvi", "name": "application/x-dvi" },
    { "id": 116, "type": ".dwf", "name": "drawing/x-dwf" },
    { "id": 117, "type": ".dwp", "name": "application/octet-stream" },
    { "id": 118, "type": ".dxr", "name": "application/x-director" },
    { "id": 119, "type": ".eml", "name": "message/rfc822" },
    { "id": 120, "type": ".emz", "name": "application/octet-stream" },
    { "id": 121, "type": ".eot", "name": "application/octet-stream" },
    { "id": 122, "type": ".eps", "name": "application/postscript" },
    { "id": 123, "type": ".etl", "name": "application/etl" },
    { "id": 124, "type": ".etx", "name": "text/x-setext" },
    { "id": 125, "type": ".evy", "name": "application/envoy" },
    { "id": 126, "type": ".exe", "name": "application/octet-stream" },
    { "id": 127, "type": ".exe.config", "name": "text/xml" },
    { "id": 128, "type": ".fdf", "name": "application/vnd.fdf" },
    { "id": 129, "type": ".fif", "name": "application/fractals" },
    { "id": 130, "type": ".filters", "name": "Application/xml" },
    { "id": 131, "type": ".fla", "name": "application/octet-stream" },
    { "id": 132, "type": ".flr", "name": "x-world/x-vrml" },
    { "id": 133, "type": ".flv", "name": "video/x-flv" },
    { "id": 134, "type": ".fsscript", "name": "application/fsharp-script" },
    { "id": 135, "type": ".fsx", "name": "application/fsharp-script" },
    { "id": 136, "type": ".generictest", "name": "application/xml" },
    { "id": 137, "type": ".gif", "name": "image/gif" },
    { "id": 138, "type": ".group", "name": "text/x-ms-group" },
    { "id": 139, "type": ".gsm", "name": "audio/x-gsm" },
    { "id": 140, "type": ".gtar", "name": "application/x-gtar" },
    { "id": 141, "type": ".gz", "name": "application/x-gzip" },
    { "id": 142, "type": ".h", "name": "text/plain" },
    { "id": 143, "type": ".hdf", "name": "application/x-hdf" },
    { "id": 144, "type": ".hdml", "name": "text/x-hdml" },
    { "id": 145, "type": ".hhc", "name": "application/x-oleobject" },
    { "id": 146, "type": ".hhk", "name": "application/octet-stream" },
    { "id": 147, "type": ".hhp", "name": "application/octet-stream" },
    { "id": 148, "type": ".hlp", "name": "application/winhlp" },
    { "id": 149, "type": ".hpp", "name": "text/plain" },
    { "id": 150, "type": ".hqx", "name": "application/mac-binhex40" },
    { "id": 151, "type": ".hta", "name": "application/hta" },
    { "id": 152, "type": ".htc", "name": "text/x-component" },
    { "id": 153, "type": ".htm", "name": "text/html" },
    { "id": 154, "type": ".html", "name": "text/html" },
    { "id": 155, "type": ".htt", "name": "text/webviewhtml" },
    { "id": 156, "type": ".hxa", "name": "application/xml" },
    { "id": 157, "type": ".hxc", "name": "application/xml" },
    { "id": 158, "type": ".hxd", "name": "application/octet-stream" },
    { "id": 159, "type": ".hxe", "name": "application/xml" },
    { "id": 160, "type": ".hxf", "name": "application/xml" },
    { "id": 161, "type": ".hxh", "name": "application/octet-stream" },
    { "id": 162, "type": ".hxi", "name": "application/octet-stream" },
    { "id": 163, "type": ".hxk", "name": "application/xml" },
    { "id": 164, "type": ".hxq", "name": "application/octet-stream" },
    { "id": 165, "type": ".hxr", "name": "application/octet-stream" },
    { "id": 166, "type": ".hxs", "name": "application/octet-stream" },
    { "id": 167, "type": ".hxt", "name": "text/html" },
    { "id": 168, "type": ".hxv", "name": "application/xml" },
    { "id": 169, "type": ".hxw", "name": "application/octet-stream" },
    { "id": 170, "type": ".hxx", "name": "text/plain" },
    { "id": 171, "type": ".i", "name": "text/plain" },
    { "id": 172, "type": ".ico", "name": "image/x-icon" },
    { "id": 173, "type": ".ics", "name": "application/octet-stream" },
    { "id": 174, "type": ".idl", "name": "text/plain" },
    { "id": 175, "type": ".ief", "name": "image/ief" },
    { "id": 176, "type": ".iii", "name": "application/x-iphone" },
    { "id": 177, "type": ".inc", "name": "text/plain" },
    { "id": 178, "type": ".inf", "name": "application/octet-stream" },
    { "id": 179, "type": ".inl", "name": "text/plain" },
    { "id": 180, "type": ".ins", "name": "application/x-internet-signup" },
    { "id": 181, "type": ".ipa", "name": "application/x-itunes-ipa" },
    { "id": 182, "type": ".ipg", "name": "application/x-itunes-ipg" },
    { "id": 183, "type": ".ipproj", "name": "text/plain" },
    { "id": 184, "type": ".ipsw", "name": "application/x-itunes-ipsw" },
    { "id": 185, "type": ".iqy", "name": "text/x-ms-iqy" },
    { "id": 186, "type": ".isp", "name": "application/x-internet-signup" },
    { "id": 187, "type": ".ite", "name": "application/x-itunes-ite" },
    { "id": 188, "type": ".itlp", "name": "application/x-itunes-itlp" },
    { "id": 189, "type": ".itms", "name": "application/x-itunes-itms" },
    { "id": 190, "type": ".itpc", "name": "application/x-itunes-itpc" },
    { "id": 191, "type": ".IVF", "name": "video/x-ivf" },
    { "id": 192, "type": ".jar", "name": "application/java-archive" },
    { "id": 193, "type": ".java", "name": "application/octet-stream" },
    { "id": 194, "type": ".jck", "name": "application/liquidmotion" },
    { "id": 195, "type": ".jcz", "name": "application/liquidmotion" },
    { "id": 196, "type": ".jfif", "name": "image/pjpeg" },
    { "id": 197, "type": ".jnlp", "name": "application/x-java-jnlp-file" },
    { "id": 198, "type": ".jpb", "name": "application/octet-stream" },
    { "id": 199, "type": ".jpe", "name": "image/jpeg" },
    { "id": 200, "type": ".jpeg", "name": "image/jpeg" },
    { "id": 201, "type": ".jpg", "name": "image/jpeg" },
    { "id": 202, "type": ".js", "name": "application/x-javascript" },
    { "id": 203, "type": ".json", "name": "application/json" },
    { "id": 204, "type": ".jsx", "name": "text/jscript" },
    { "id": 205, "type": ".jsxbin", "name": "text/plain" },
    { "id": 206, "type": ".latex", "name": "application/x-latex" },
    { "id": 207, "type": ".library-ms", "name": "application/windows-library+xml" },
    { "id": 208, "type": ".lit", "name": "application/x-ms-reader" },
    { "id": 209, "type": ".loadtest", "name": "application/xml" },
    { "id": 210, "type": ".lpk", "name": "application/octet-stream" },
    { "id": 211, "type": ".lsf", "name": "video/x-la-asf" },
    { "id": 212, "type": ".lst", "name": "text/plain" },
    { "id": 213, "type": ".lsx", "name": "video/x-la-asf" },
    { "id": 214, "type": ".lzh", "name": "application/octet-stream" },
    { "id": 215, "type": ".m13", "name": "application/x-msmediaview" },
    { "id": 216, "type": ".m14", "name": "application/x-msmediaview" },
    { "id": 217, "type": ".m1v", "name": "video/mpeg" },
    { "id": 218, "type": ".m2t", "name": "video/vnd.dlna.mpeg-tts" },
    { "id": 219, "type": ".m2ts", "name": "video/vnd.dlna.mpeg-tts" },
    { "id": 220, "type": ".m2v", "name": "video/mpeg" },
    { "id": 221, "type": ".m3u", "name": "audio/x-mpegurl" },
    { "id": 222, "type": ".m3u8", "name": "audio/x-mpegurl" },
    { "id": 223, "type": ".m4a", "name": "audio/m4a" },
    { "id": 224, "type": ".m4b", "name": "audio/m4b" },
    { "id": 225, "type": ".m4p", "name": "audio/m4p" },
    { "id": 226, "type": ".m4r", "name": "audio/x-m4r" },
    { "id": 227, "type": ".m4v", "name": "video/x-m4v" },
    { "id": 228, "type": ".mac", "name": "image/x-macpaint" },
    { "id": 229, "type": ".mak", "name": "text/plain" },
    { "id": 230, "type": ".man", "name": "application/x-troff-man" },
    { "id": 231, "type": ".manifest", "name": "application/x-ms-manifest" },
    { "id": 232, "type": ".map", "name": "text/plain" },
    { "id": 233, "type": ".master", "name": "application/xml" },
    { "id": 234, "type": ".mda", "name": "application/msaccess" },
    { "id": 235, "type": ".mdb", "name": "application/x-msaccess" },
    { "id": 236, "type": ".mde", "name": "application/msaccess" },
    { "id": 237, "type": ".mdp", "name": "application/octet-stream" },
    { "id": 238, "type": ".me", "name": "application/x-troff-me" },
    { "id": 239, "type": ".mfp", "name": "application/x-shockwave-flash" },
    { "id": 240, "type": ".mht", "name": "message/rfc822" },
    { "id": 241, "type": ".mhtml", "name": "message/rfc822" },
    { "id": 242, "type": ".mid", "name": "audio/mid" },
    { "id": 243, "type": ".midi", "name": "audio/mid" },
    { "id": 244, "type": ".mix", "name": "application/octet-stream" },
    { "id": 245, "type": ".mk", "name": "text/plain" },
    { "id": 246, "type": ".mmf", "name": "application/x-smaf" },
    { "id": 247, "type": ".mno", "name": "text/xml" },
    { "id": 248, "type": ".mny", "name": "application/x-msmoney" },
    { "id": 249, "type": ".mod", "name": "video/mpeg" },
    { "id": 250, "type": ".mov", "name": "video/quicktime" },
    { "id": 251, "type": ".movie", "name": "video/x-sgi-movie" },
    { "id": 252, "type": ".mp2", "name": "video/mpeg" },
    { "id": 253, "type": ".mp2v", "name": "video/mpeg" },
    { "id": 254, "type": ".mp3", "name": "audio/mpeg" },
    { "id": 255, "type": ".mp4", "name": "video/mp4" },
    { "id": 256, "type": ".mp4v", "name": "video/mp4" },
    { "id": 257, "type": ".mpa", "name": "video/mpeg" },
    { "id": 258, "type": ".mpe", "name": "video/mpeg" },
    { "id": 259, "type": ".mpeg", "name": "video/mpeg" },
    { "id": 260, "type": ".mpf", "name": "application/vnd.ms-mediapackage" },
    { "id": 261, "type": ".mpg", "name": "video/mpeg" },
    { "id": 262, "type": ".mpp", "name": "application/vnd.ms-project" },
    { "id": 263, "type": ".mpv2", "name": "video/mpeg" },
    { "id": 264, "type": ".mqv", "name": "video/quicktime" },
    { "id": 265, "type": ".ms", "name": "application/x-troff-ms" },
    { "id": 266, "type": ".msi", "name": "application/octet-stream" },
    { "id": 267, "type": ".mso", "name": "application/octet-stream" },
    { "id": 268, "type": ".mts", "name": "video/vnd.dlna.mpeg-tts" },
    { "id": 269, "type": ".mtx", "name": "application/xml" },
    { "id": 270, "type": ".mvb", "name": "application/x-msmediaview" },
    { "id": 271, "type": ".mvc", "name": "application/x-miva-compiled" },
    { "id": 272, "type": ".mxp", "name": "application/x-mmxp" },
    { "id": 273, "type": ".nc", "name": "application/x-netcdf" },
    { "id": 274, "type": ".nsc", "name": "video/x-ms-asf" },
    { "id": 275, "type": ".nws", "name": "message/rfc822" },
    { "id": 276, "type": ".ocx", "name": "application/octet-stream" },
    { "id": 277, "type": ".oda", "name": "application/oda" },
    { "id": 278, "type": ".odc", "name": "text/x-ms-odc" },
    { "id": 279, "type": ".odh", "name": "text/plain" },
    { "id": 280, "type": ".odl", "name": "text/plain" },
    { "id": 281, "type": ".odp", "name": "application/vnd.oasis.opendocument.presentation" },
    { "id": 282, "type": ".ods", "name": "application/oleobject" },
    { "id": 283, "type": ".odt", "name": "application/vnd.oasis.opendocument.text" },
    { "id": 284, "type": ".one", "name": "application/onenote" },
    { "id": 285, "type": ".onea", "name": "application/onenote" },
    { "id": 286, "type": ".onepkg", "name": "application/onenote" },
    { "id": 287, "type": ".onetmp", "name": "application/onenote" },
    { "id": 288, "type": ".onetoc", "name": "application/onenote" },
    { "id": 289, "type": ".onetoc2", "name": "application/onenote" },
    { "id": 290, "type": ".orderedtest", "name": "application/xml" },
    { "id": 291, "type": ".osdx", "name": "application/opensearchdescription+xml" },
    { "id": 292, "type": ".p10", "name": "application/pkcs10" },
    { "id": 293, "type": ".p12", "name": "application/x-pkcs12" },
    { "id": 294, "type": ".p7b", "name": "application/x-pkcs7-certificates" },
    { "id": 295, "type": ".p7c", "name": "application/pkcs7-mime" },
    { "id": 296, "type": ".p7m", "name": "application/pkcs7-mime" },
    { "id": 297, "type": ".p7r", "name": "application/x-pkcs7-certreqresp" },
    { "id": 298, "type": ".p7s", "name": "application/pkcs7-signature" },
    { "id": 299, "type": ".pbm", "name": "image/x-portable-bitmap" },
    { "id": 300, "type": ".pcast", "name": "application/x-podcast" },
    { "id": 301, "type": ".pct", "name": "image/pict" },
    { "id": 302, "type": ".pcx", "name": "application/octet-stream" },
    { "id": 303, "type": ".pcz", "name": "application/octet-stream" },
    { "id": 304, "type": ".pdf", "name": "application/pdf" },
    { "id": 305, "type": ".pfb", "name": "application/octet-stream" },
    { "id": 306, "type": ".pfm", "name": "application/octet-stream" },
    { "id": 307, "type": ".pfx", "name": "application/x-pkcs12" },
    { "id": 308, "type": ".pgm", "name": "image/x-portable-graymap" },
    { "id": 309, "type": ".pic", "name": "image/pict" },
    { "id": 310, "type": ".pict", "name": "image/pict" },
    { "id": 311, "type": ".pkgdef", "name": "text/plain" },
    { "id": 312, "type": ".pkgundef", "name": "text/plain" },
    { "id": 313, "type": ".pko", "name": "application/vnd.ms-pki.pko" },
    { "id": 314, "type": ".pls", "name": "audio/scpls" },
    { "id": 315, "type": ".pma", "name": "application/x-perfmon" },
    { "id": 316, "type": ".pmc", "name": "application/x-perfmon" },
    { "id": 317, "type": ".pml", "name": "application/x-perfmon" },
    { "id": 318, "type": ".pmr", "name": "application/x-perfmon" },
    { "id": 319, "type": ".pmw", "name": "application/x-perfmon" },
    { "id": 320, "type": ".png", "name": "image/png" },
    { "id": 321, "type": ".pnm", "name": "image/x-portable-anymap" },
    { "id": 322, "type": ".pnt", "name": "image/x-macpaint" },
    { "id": 323, "type": ".pntg", "name": "image/x-macpaint" },
    { "id": 324, "type": ".pnz", "name": "image/png" },
    { "id": 325, "type": ".pot", "name": "application/vnd.ms-powerpoint" },
    { "id": 326, "type": ".potm", "name": "application/vnd.ms-powerpoint.template.macroEnabled.12" },
    { "id": 327, "type": ".potx", "name": "application/vnd.openxmlformats-officedocument.presentationml.template" },
    { "id": 328, "type": ".ppa", "name": "application/vnd.ms-powerpoint" },
    { "id": 329, "type": ".ppam", "name": "application/vnd.ms-powerpoint.addin.macroEnabled.12" },
    { "id": 330, "type": ".ppm", "name": "image/x-portable-pixmap" },
    { "id": 331, "type": ".pps", "name": "application/vnd.ms-powerpoint" },
    { "id": 332, "type": ".ppsm", "name": "application/vnd.ms-powerpoint.slideshow.macroEnabled.12" },
    { "id": 333, "type": ".ppsx", "name": "application/vnd.openxmlformats-officedocument.presentationml.slideshow" },
    { "id": 334, "type": ".ppt", "name": "application/vnd.ms-powerpoint" },
    { "id": 335, "type": ".pptm", "name": "application/vnd.ms-powerpoint.presentation.macroEnabled.12" },
    { "id": 336, "type": ".pptx", "name": "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    { "id": 337, "type": ".prf", "name": "application/pics-rules" },
    { "id": 338, "type": ".prm", "name": "application/octet-stream" },
    { "id": 339, "type": ".prx", "name": "application/octet-stream" },
    { "id": 340, "type": ".ps", "name": "application/postscript" },
    { "id": 341, "type": ".psc1", "name": "application/PowerShell" },
    { "id": 342, "type": ".psd", "name": "application/octet-stream" },
    { "id": 343, "type": ".psess", "name": "application/xml" },
    { "id": 344, "type": ".psm", "name": "application/octet-stream" },
    { "id": 345, "type": ".psp", "name": "application/octet-stream" },
    { "id": 346, "type": ".pub", "name": "application/x-mspublisher" },
    { "id": 347, "type": ".pwz", "name": "application/vnd.ms-powerpoint" },
    { "id": 348, "type": ".qht", "name": "text/x-html-insertion" },
    { "id": 349, "type": ".qhtm", "name": "text/x-html-insertion" },
    { "id": 350, "type": ".qt", "name": "video/quicktime" },
    { "id": 351, "type": ".qti", "name": "image/x-quicktime" },
    { "id": 352, "type": ".qtif", "name": "image/x-quicktime" },
    { "id": 353, "type": ".qtl", "name": "application/x-quicktimeplayer" },
    { "id": 354, "type": ".qxd", "name": "application/octet-stream" },
    { "id": 355, "type": ".ra", "name": "audio/x-pn-realaudio" },
    { "id": 356, "type": ".ram", "name": "audio/x-pn-realaudio" },
    { "id": 357, "type": ".rar", "name": "application/octet-stream" },
    { "id": 358, "type": ".ras", "name": "image/x-cmu-raster" },
    { "id": 359, "type": ".rat", "name": "application/rat-file" },
    { "id": 360, "type": ".rc", "name": "text/plain" },
    { "id": 361, "type": ".rc2", "name": "text/plain" },
    { "id": 362, "type": ".rct", "name": "text/plain" },
    { "id": 363, "type": ".rdlc", "name": "application/xml" },
    { "id": 364, "type": ".resx", "name": "application/xml" },
    { "id": 365, "type": ".rf", "name": "image/vnd.rn-realflash" },
    { "id": 366, "type": ".rgb", "name": "image/x-rgb" },
    { "id": 367, "type": ".rgs", "name": "text/plain" },
    { "id": 368, "type": ".rm", "name": "application/vnd.rn-realmedia" },
    { "id": 369, "type": ".rmi", "name": "audio/mid" },
    { "id": 370, "type": ".rmp", "name": "application/vnd.rn-rn_music_package" },
    { "id": 371, "type": ".roff", "name": "application/x-troff" },
    { "id": 372, "type": ".rpm", "name": "audio/x-pn-realaudio-plugin" },
    { "id": 373, "type": ".rqy", "name": "text/x-ms-rqy" },
    { "id": 374, "type": ".rtf", "name": "application/rtf" },
    { "id": 375, "type": ".rtx", "name": "text/richtext" },
    { "id": 376, "type": ".ruleset", "name": "application/xml" },
    { "id": 377, "type": ".s", "name": "text/plain" },
    { "id": 378, "type": ".safariextz", "name": "application/x-safari-safariextz" },
    { "id": 379, "type": ".scd", "name": "application/x-msschedule" },
    { "id": 380, "type": ".sct", "name": "text/scriptlet" },
    { "id": 381, "type": ".sd2", "name": "audio/x-sd2" },
    { "id": 382, "type": ".sdp", "name": "application/sdp" },
    { "id": 383, "type": ".sea", "name": "application/octet-stream" },
    { "id": 384, "type": ".searchConnector-ms", "name": "application/windows-search-connector+xml" },
    { "id": 385, "type": ".setpay", "name": "application/set-payment-initiation" },
    { "id": 386, "type": ".setreg", "name": "application/set-registration-initiation" },
    { "id": 387, "type": ".settings", "name": "application/xml" },
    { "id": 388, "type": ".sgimb", "name": "application/x-sgimb" },
    { "id": 389, "type": ".sgml", "name": "text/sgml" },
    { "id": 390, "type": ".sh", "name": "application/x-sh" },
    { "id": 391, "type": ".shar", "name": "application/x-shar" },
    { "id": 392, "type": ".shtml", "name": "text/html" },
    { "id": 393, "type": ".sit", "name": "application/x-stuffit" },
    { "id": 394, "type": ".sitemap", "name": "application/xml" },
    { "id": 395, "type": ".skin", "name": "application/xml" },
    { "id": 396, "type": ".sldm", "name": "application/vnd.ms-powerpoint.slide.macroEnabled.12" },
    { "id": 397, "type": ".sldx", "name": "application/vnd.openxmlformats-officedocument.presentationml.slide" },
    { "id": 398, "type": ".slk", "name": "application/vnd.ms-excel" },
    { "id": 399, "type": ".sln", "name": "text/plain" },
    { "id": 400, "type": ".slupkg-ms", "name": "application/x-ms-license" },
    { "id": 401, "type": ".smd", "name": "audio/x-smd" },
    { "id": 402, "type": ".smi", "name": "application/octet-stream" },
    { "id": 403, "type": ".smx", "name": "audio/x-smd" },
    { "id": 404, "type": ".smz", "name": "audio/x-smd" },
    { "id": 405, "type": ".snd", "name": "audio/basic" },
    { "id": 406, "type": ".snippet", "name": "application/xml" },
    { "id": 407, "type": ".snp", "name": "application/octet-stream" },
    { "id": 408, "type": ".sol", "name": "text/plain" },
    { "id": 409, "type": ".sor", "name": "text/plain" },
    { "id": 410, "type": ".spc", "name": "application/x-pkcs7-certificates" },
    { "id": 411, "type": ".spl", "name": "application/futuresplash" },
    { "id": 412, "type": ".src", "name": "application/x-wais-source" },
    { "id": 413, "type": ".srf", "name": "text/plain" },
    { "id": 414, "type": ".SSISDeploymentManifest", "name": "text/xml" },
    { "id": 415, "type": ".ssm", "name": "application/streamingmedia" },
    { "id": 416, "type": ".sst", "name": "application/vnd.ms-pki.certstore" },
    { "id": 417, "type": ".stl", "name": "application/vnd.ms-pki.stl" },
    { "id": 418, "type": ".sv4cpio", "name": "application/x-sv4cpio" },
    { "id": 419, "type": ".sv4crc", "name": "application/x-sv4crc" },
    { "id": 420, "type": ".svc", "name": "application/xml" },
    { "id": 421, "type": ".swf", "name": "application/x-shockwave-flash" },
    { "id": 422, "type": ".t", "name": "application/x-troff" },
    { "id": 423, "type": ".tar", "name": "application/x-tar" },
    { "id": 424, "type": ".tcl", "name": "application/x-tcl" },
    { "id": 425, "type": ".testrunconfig", "name": "application/xml" },
    { "id": 426, "type": ".testsettings", "name": "application/xml" },
    { "id": 427, "type": ".tex", "name": "application/x-tex" },
    { "id": 428, "type": ".texi", "name": "application/x-texinfo" },
    { "id": 429, "type": ".texinfo", "name": "application/x-texinfo" },
    { "id": 430, "type": ".tgz", "name": "application/x-compressed" },
    { "id": 431, "type": ".thmx", "name": "application/vnd.ms-officetheme" },
    { "id": 432, "type": ".thn", "name": "application/octet-stream" },
    { "id": 433, "type": ".tif", "name": "image/tiff" },
    { "id": 434, "type": ".tiff", "name": "image/tiff" },
    { "id": 435, "type": ".tlh", "name": "text/plain" },
    { "id": 436, "type": ".tli", "name": "text/plain" },
    { "id": 437, "type": ".toc", "name": "application/octet-stream" },
    { "id": 438, "type": ".tr", "name": "application/x-troff" },
    { "id": 439, "type": ".trm", "name": "application/x-msterminal" },
    { "id": 440, "type": ".trx", "name": "application/xml" },
    { "id": 441, "type": ".ts", "name": "video/vnd.dlna.mpeg-tts" },
    { "id": 442, "type": ".tsv", "name": "text/tab-separated-values" },
    { "id": 443, "type": ".ttf", "name": "application/octet-stream" },
    { "id": 444, "type": ".tts", "name": "video/vnd.dlna.mpeg-tts" },
    { "id": 445, "type": ".txt", "name": "text/plain" },
    { "id": 446, "type": ".u32", "name": "application/octet-stream" },
    { "id": 447, "type": ".uls", "name": "text/iuls" },
    { "id": 448, "type": ".user", "name": "text/plain" },
    { "id": 449, "type": ".ustar", "name": "application/x-ustar" },
    { "id": 450, "type": ".vb", "name": "text/plain" },
    { "id": 451, "type": ".vbdproj", "name": "text/plain" },
    { "id": 452, "type": ".vbk", "name": "video/mpeg" },
    { "id": 453, "type": ".vbproj", "name": "text/plain" },
    { "id": 454, "type": ".vbs", "name": "text/vbscript" },
    { "id": 455, "type": ".vcf", "name": "text/x-vcard" },
    { "id": 456, "type": ".vcproj", "name": "Application/xml" },
    { "id": 457, "type": ".vcs", "name": "text/plain" },
    { "id": 458, "type": ".vcxproj", "name": "Application/xml" },
    { "id": 459, "type": ".vddproj", "name": "text/plain" },
    { "id": 460, "type": ".vdp", "name": "text/plain" },
    { "id": 461, "type": ".vdproj", "name": "text/plain" },
    { "id": 462, "type": ".vdx", "name": "application/vnd.ms-visio.viewer" },
    { "id": 463, "type": ".vml", "name": "text/xml" },
    { "id": 464, "type": ".vscontent", "name": "application/xml" },
    { "id": 465, "type": ".vsct", "name": "text/xml" },
    { "id": 466, "type": ".vsd", "name": "application/vnd.visio" },
    { "id": 467, "type": ".vsi", "name": "application/ms-vsi" },
    { "id": 468, "type": ".vsix", "name": "application/vsix" },
    { "id": 469, "type": ".vsixlangpack", "name": "text/xml" },
    { "id": 470, "type": ".vsixmanifest", "name": "text/xml" },
    { "id": 471, "type": ".vsmdi", "name": "application/xml" },
    { "id": 472, "type": ".vspscc", "name": "text/plain" },
    { "id": 473, "type": ".vss", "name": "application/vnd.visio" },
    { "id": 474, "type": ".vsscc", "name": "text/plain" },
    { "id": 475, "type": ".vssettings", "name": "text/xml" },
    { "id": 476, "type": ".vssscc", "name": "text/plain" },
    { "id": 477, "type": ".vst", "name": "application/vnd.visio" },
    { "id": 478, "type": ".vstemplate", "name": "text/xml" },
    { "id": 479, "type": ".vsto", "name": "application/x-ms-vsto" },
    { "id": 480, "type": ".vsw", "name": "application/vnd.visio" },
    { "id": 481, "type": ".vsx", "name": "application/vnd.visio" },
    { "id": 482, "type": ".vtx", "name": "application/vnd.visio" },
    { "id": 483, "type": ".wav", "name": "audio/wav" },
    { "id": 484, "type": ".wave", "name": "audio/wav" },
    { "id": 485, "type": ".wax", "name": "audio/x-ms-wax" },
    { "id": 486, "type": ".wbk", "name": "application/msword" },
    { "id": 487, "type": ".wbmp", "name": "image/vnd.wap.wbmp" },
    { "id": 488, "type": ".wcm", "name": "application/vnd.ms-works" },
    { "id": 489, "type": ".wdb", "name": "application/vnd.ms-works" },
    { "id": 490, "type": ".wdp", "name": "image/vnd.ms-photo" },
    { "id": 491, "type": ".webarchive", "name": "application/x-safari-webarchive" },
    { "id": 492, "type": ".webtest", "name": "application/xml" },
    { "id": 493, "type": ".wiq", "name": "application/xml" },
    { "id": 494, "type": ".wiz", "name": "application/msword" },
    { "id": 495, "type": ".wks", "name": "application/vnd.ms-works" },
    { "id": 496, "type": ".WLMP", "name": "application/wlmoviemaker" },
    { "id": 497, "type": ".wlpginstall", "name": "application/x-wlpg-detect" },
    { "id": 498, "type": ".wlpginstall3", "name": "application/x-wlpg3-detect" },
    { "id": 499, "type": ".wm", "name": "video/x-ms-wm" },
    { "id": 500, "type": ".wma", "name": "audio/x-ms-wma" },
    { "id": 501, "type": ".wmd", "name": "application/x-ms-wmd" },
    { "id": 502, "type": ".wmf", "name": "application/x-msmetafile" },
    { "id": 503, "type": ".wml", "name": "text/vnd.wap.wml" },
    { "id": 504, "type": ".wmlc", "name": "application/vnd.wap.wmlc" },
    { "id": 505, "type": ".wmls", "name": "text/vnd.wap.wmlscript" },
    { "id": 506, "type": ".wmlsc", "name": "application/vnd.wap.wmlscriptc" },
    { "id": 507, "type": ".wmp", "name": "video/x-ms-wmp" },
    { "id": 508, "type": ".wmv", "name": "video/x-ms-wmv" },
    { "id": 509, "type": ".wmx", "name": "video/x-ms-wmx" },
    { "id": 510, "type": ".wmz", "name": "application/x-ms-wmz" },
    { "id": 511, "type": ".wpl", "name": "application/vnd.ms-wpl" },
    { "id": 512, "type": ".wps", "name": "application/vnd.ms-works" },
    { "id": 513, "type": ".wri", "name": "application/x-mswrite" },
    { "id": 514, "type": ".wrl", "name": "x-world/x-vrml" },
    { "id": 515, "type": ".wrz", "name": "x-world/x-vrml" },
    { "id": 516, "type": ".wsc", "name": "text/scriptlet" },
    { "id": 517, "type": ".wsdl", "name": "text/xml" },
    { "id": 518, "type": ".wvx", "name": "video/x-ms-wvx" },
    { "id": 519, "type": ".x", "name": "application/directx" },
    { "id": 520, "type": ".xaf", "name": "x-world/x-vrml" },
    { "id": 521, "type": ".xaml", "name": "application/xaml+xml" },
    { "id": 522, "type": ".xap", "name": "application/x-silverlight-app" },
    { "id": 523, "type": ".xbap", "name": "application/x-ms-xbap" },
    { "id": 524, "type": ".xbm", "name": "image/x-xbitmap" },
    { "id": 525, "type": ".xdr", "name": "text/plain" },
    { "id": 526, "type": ".xht", "name": "application/xhtml+xml" },
    { "id": 527, "type": ".xhtml", "name": "application/xhtml+xml" },
    { "id": 528, "type": ".xla", "name": "application/vnd.ms-excel" },
    { "id": 529, "type": ".xlam", "name": "application/vnd.ms-excel.addin.macroEnabled.12" },
    { "id": 530, "type": ".xlc", "name": "application/vnd.ms-excel" },
    { "id": 531, "type": ".xld", "name": "application/vnd.ms-excel" },
    { "id": 532, "type": ".xlk", "name": "application/vnd.ms-excel" },
    { "id": 533, "type": ".xll", "name": "application/vnd.ms-excel" },
    { "id": 534, "type": ".xlm", "name": "application/vnd.ms-excel" },
    { "id": 535, "type": ".xls", "name": "application/vnd.ms-excel" },
    { "id": 536, "type": ".xlsb", "name": "application/vnd.ms-excel.sheet.binary.macroEnabled.12" },
    { "id": 537, "type": ".xlsm", "name": "application/vnd.ms-excel.sheet.macroEnabled.12" },
    { "id": 538, "type": ".xlsx", "name": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { "id": 539, "type": ".xlt", "name": "application/vnd.ms-excel" },
    { "id": 540, "type": ".xltm", "name": "application/vnd.ms-excel.template.macroEnabled.12" },
    { "id": 541, "type": ".xltx", "name": "application/vnd.openxmlformats-officedocument.spreadsheetml.template" },
    { "id": 542, "type": ".xlw", "name": "application/vnd.ms-excel" },
    { "id": 543, "type": ".xml", "name": "text/xml" },
    { "id": 544, "type": ".xmta", "name": "application/xml" },
    { "id": 545, "type": ".xof", "name": "x-world/x-vrml" },
    { "id": 546, "type": ".XOML", "name": "text/plain" },
    { "id": 547, "type": ".xpm", "name": "image/x-xpixmap" },
    { "id": 548, "type": ".xps", "name": "application/vnd.ms-xpsdocument" },
    { "id": 549, "type": ".xrm-ms", "name": "text/xml" },
    { "id": 550, "type": ".xsc", "name": "application/xml" },
    { "id": 551, "type": ".xsd", "name": "text/xml" },
    { "id": 552, "type": ".xsf", "name": "text/xml" },
    { "id": 553, "type": ".xsl", "name": "text/xml" },
    { "id": 554, "type": ".xslt", "name": "text/xml" },
    { "id": 555, "type": ".xsn", "name": "application/octet-stream" },
    { "id": 556, "type": ".xss", "name": "application/xml" },
    { "id": 557, "type": ".xtp", "name": "application/octet-stream" },
    { "id": 558, "type": ".xwd", "name": "image/x-xwindowdump" },
    { "id": 559, "type": ".z", "name": "application/x-compress" },
    { "id": 560, "type": ".zip", "name": "application/x-zip-compressed" }
];