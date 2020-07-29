
mKeyAttr = 'io';
mSiteCode = '';
mHost = '';
mHostView = '';

if (!mIsIE) {
    mUrlSrcSelf = new URL(document.currentScript.src);
    mHost = mUrlSrcSelf.protocol + '//' + mUrlSrcSelf.host;
    mHostView = mUrlSrcSelf.protocol + '//' + mUrlSrcSelf.host + '/views';
}