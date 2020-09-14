$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
const API_URL = 'http://localhost:5000/api';
const MQTT = 'http://localhost:5001/send-command';
const currentUser = localStorage.getItem('user');
if (currentUser) {
  $.get(`${API_URL}/users/${currentUser}/fridges`)
    .then(response => {
      response.forEach((fridge) => {
        $('#fridges tbody').append(`
         <tr data-fridge-id=${fridge._id}>
           <td>${fridge.user}</td>
           <td>${fridge.name}</td>
         </tr>`
        );
      });
      $('#fridges tbody tr').on('click', (e) => {
        const fridgeId = e.currentTarget.getAttribute('data-fridge-id');
        $.get(`${API_URL}/fridges/${fridgeId}/fridge-history`)
          .then(response => {
            response.map(sensorData => {
              $('#historyContent').append(`
            <tr>
              <td>${sensorData.ts}</td>
              <td>${sensorData.temp}</td>
              <td>${sensorData.loc.lat}</td>
              <td>${sensorData.loc.lon}</td>
            </tr>
            `);
            });
            $('#historyModal').modal('show');
          });
      });
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
} else {
  const path = window.location.pathname;
  if (path !== '/login' && path !== '/registration') {
    location.href = '/login';
  }
}


  // $.get(`${API_URL}/users`)
  //   .then(response => {
  //       $('#users tbody').append(`
  //          <td>${user.user}</td>
  //        </tr>`
  //       );
  //     })
  //   .catch(error => {
  //     console.error(`Error: ${error}`);
  //   });

// $.get(`${API_URL}/fridges`)
//   .then(response => {
//     response.forEach(fridge => {
//       $('#fridges tbody').append(`
//  <tr>
//  <td>${fridge.user}</td>
//  <td>${fridge.name}</td>
//  </tr>`
//       );
//     });
//   })
//   .catch(error => {
//     console.error(`Error: ${error}`);
//   });
//const devices = JSON.parse(localStorage.getItem('devices')) || [];
//const users = JSON.parse(localStorage.getItem('users')) || [];
// $.get(`${API_URL}/users`)
// .then(response => {

// })

$('#add-fridge').on('click', () => {
  const name = $('#name').val();
  const user = $('#user').val();
  const sensorData = [];
  const body = {
    name,
    user,
    sensorData
  };

  $.post(`${API_URL}/fridges`, body)
    .then(response => {
      location.href = '/';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
})

$('#send-command').on('click', function () {
  const command = $('#command').val();
  const fridgeId = $('#fridgeId').val();

  $.post(`${MQTT}`, { command, fridgeId })
    .then((response) => {
      if (response.success) {
        location.href = '/';
      }
    })
});
$('#register').on('click', () => {
  const user = $('#user').val();
  const password = $('#password').val();
  const confirm = $('#confirm').val();
  if (password !== confirm) {
    $('#message').append('<p class="alert alert-danger">Passwords do not match</p>');
  } else {
    $.post(`${API_URL}/registration`, { user, password })
      .then((response) => {
        if (response.success) {
          location.href = '/login';
        } else {
          $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
      });
    //   $.get(`${API_URL}/users`)
    // .then(response => {
    //     $('#users tbody').append(`
    //        <td>${user}</td>
    //      </tr>`
    //     );
    //   })
    // .catch(error => {
    //   console.error(`Error: ${error}`);
    // });
  }
});
$('#login').on('click', () => {
  const user = $('#user').val();
  const password = $('#password').val();
  $.post(`${API_URL}/authenticate`, { user, password })
    .then((response) => {
      if (response.success) {
        localStorage.setItem('user', user);
        localStorage.setItem('isAdmin', response.isAdmin);
        localStorage.setItem('isAuthenticated', true);
        location.href = '/';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}
     </p>`);
      }
    });
});
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  location.href = '/login';

}