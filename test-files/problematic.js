// Problematic JavaScript file - should get low score with many issues
var globalVar = "bad practice";

function messyFunction(data) {
  if (data) {
    if (data.type === 'user') {
      if (data.active) {
        if (data.permissions) {
          if (data.permissions.read) {
            if (data.permissions.write) {
              if (data.permissions.delete) {
                console.log('Full access granted');
                document.innerHTML = data.content; // Security issue
                return eval('(' + data.code + ')'); // Security issue
              } else {
                console.log('No delete permission');
              }
            } else {
              console.log('No write permission');
            }
          } else {
            console.log('No read permission');
          }
        } else {
          console.log('No permissions defined');
        }
      } else {
        console.log('User inactive');
      }
    } else {
      console.log('Not a user');
    }
  } else {
    console.log('No data provided');
  }
}

// Duplicate code blocks
function processUserData(user) {
  if (user && user.id) {
    console.log('Processing user:', user.name);
    return user;
  }
  return null;
}

function processAdminData(admin) {
  if (admin && admin.id) {
    console.log('Processing admin:', admin.name);
    return admin;
  }
  return null;
}

function processGuestData(guest) {
  if (guest && guest.id) {
    console.log('Processing guest:', guest.name);
    return guest;
  }
  return null;
}

// More complexity
function handleRequest(req, res) {
  if (req.method === 'GET') {
    if (req.url === '/users') {
      if (req.headers.authorization) {
        if (req.headers.authorization.startsWith('Bearer ')) {
          // Process request
          console.log('GET /users authorized');
        } else {
          console.log('Invalid authorization format');
        }
      } else {
        console.log('No authorization header');
      }
    } else if (req.url === '/admin') {
      console.log('Admin endpoint accessed');
    } else {
      console.log('Unknown endpoint');
    }
  } else if (req.method === 'POST') {
    console.log('POST request received');
  } else {
    console.log('Unsupported method');
  }
}