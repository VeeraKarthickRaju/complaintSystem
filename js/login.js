function loginUser() {
	var userID = document.getElementById('userid').value;
	var pwd = document.getElementById('pwd').value;
	var role = document.getElementById('role').value;
	if (userID && pwd && role !== "select") {
		$.ajax({
			url: "http://localhost:3000/login?userID=" + userID + "&password=" + pwd + "&role=" + role,
			type: 'GET',
			async: false,
			cache: false,
			contentType: 'application/json',
			processData: false,
			success: function (data) {

				if (data.success) {
					localStorage.setItem('userID', userID);
					localStorage.setItem('password', pwd);
					localStorage.setItem('role', role);
					location.href = 'home.html';
				} else {
					$(".failure").text(data.error);
					$("#loginFail").modal();
				}
			},
			error: function (err) {
				$(".failure").text(err);
				$("#loginFail").modal();
			}
		});
	}
	else {
		$(".failure").text("Please enter UserID and Password, then select your correct role");
		$("#loginFail").modal();
	}
};


function signUp() {
	$(".mt-2").hide()
	$(".txtBlue").text("Sign Up");
	$(".mobNo").css("display", "block");
	$(".register").show();
};

function registerUser() {
	var userID = document.getElementById('userid').value;
	var pwd = document.getElementById('pwd').value;
	var mobile = document.getElementById('mobNo').value;
	var role = document.getElementById('role').value;
	console.log(userID, pwd, role)
	if (userID && pwd && role !== "select" && mobile) {
		$.ajax({
			url: "http://localhost:3000/register",
			type: 'POST',
			async: false,
			cache: false,
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify({
				"userID": userID,
				"password": pwd,
				"mobile": mobile,
				"role": role
			}),
			success: function (data) {

				if (data.success) {
					swal(data.success);
				} else {
					swal(data.error);
				}
			},
			error: function (err) {
				swal(err);
			}
		});
	}
	else {
		swal("Please enter UserID, Password, Mobile Number and Select Role");
	}
}