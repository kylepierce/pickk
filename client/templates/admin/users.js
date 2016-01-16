Template.adminUsers.helpers({
	'user': function(){
		return UserList.find({ }).fetch()
	}
})