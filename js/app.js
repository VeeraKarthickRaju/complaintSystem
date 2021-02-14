function imageIconClick() {
	$('[data-toggle="popover"]').popover();
};

function logOutUser() {
	location.href = 'index.html';
	localStorage.removeItem('userID');
	localStorage.removeItem('password');
	localStorage.removeItem('role');
};


$(document).ready(function () {

	if (localStorage.getItem('userID')) {
		$('#userNameBtn')[0].innerText = localStorage.getItem('userID');
	}

	if (localStorage.getItem('role')) {
		$('#role')[0].innerText = localStorage.getItem('role');
	}

	if (localStorage.getItem('role') === 'agent') {
		$('.homewhite').text("Dropdown Selection of Complaint, Assign Complaints, Close complaints will come here.");
		$('.sideMenu-item-deal').css('display', "none")
	}
});
