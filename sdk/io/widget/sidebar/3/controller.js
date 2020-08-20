{
    data: function () {
        return {
            visibleAvatarPanel: false,
            visibleWebCreator: false,
            visibleWebCreatorSuccessfully: false
        };
    },
    created: function () {

    },
    mounted: function () {
        var _self = this;
        //console.log(3)
    },
    methods: {
        logoutClick: function() {
            _ioUI_userLogout(function () {
                _ioUI_pageGo('login');
            });
        },
        avatarClick: function (event) {
            var _self = this;
            var action = _self.visibleAvatarPanel ? 'hide' : 'show';

            $('#' + _self._PageId + ' .ui-user-avatar').dropdown(action);
            _self.visibleAvatarPanel = !_self.visibleAvatarPanel;

            //$('#' + _self._PageId + ' .ui-user-avatar').dropdown('toggle');

            
            console.log(action, _self.visibleAvatarPanel);

            event.preventDefault();
            event.stopPropagation();
        }
    }
}