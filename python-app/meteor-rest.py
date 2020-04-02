import requests, argparse

parser = argparse.ArgumentParser(description='Test Meteor REST api with public & authenticated requests')
parser.add_argument('username', help='The username to your application\'s admin account')
parser.add_argument('password', help='The password for your application\'s admin account')
args = parser.parse_args()

protocol = "http" # make sure to use https in production!
url = "localhost"
port = 3000

# make a request to the public endpoint
public_link = {'title': 'GitHub', 'url': 'https://github.com'}
public_url = f'{protocol}://{url}:{port}/api/links/insert/public'
public_request = requests.post(public_url, params=public_link)
print(f"Requested link creation via {public_url}: {public_request.json()}")

# build a login authentication request using the admin's details
login_data = {'username': args.username, 'password': args.password}
login_url = f'{protocol}://{url}:{port}/api/login/'
login_request =  r = requests.post(login_url, data=login_data)
login_request_response = login_request.json()

if (login_request_response['status'] == "success"):
  login_data = login_request.json()['data']
  print(f"Successfully authenticated via {login_url}: {login_data}")

  # build the authenticated request headers from the 
  auth_headers = { "X-Auth-Token" : login_data['authToken'], "X-User-Id" : login_data['userId'] }
  private_link = {'title': 'Stack Overflow', 'url': 'https://stackoverflow.com/'}

  # make a request to the authenticated-only endpoint
  private_url = f'{protocol}://{url}:{port}/api/links/insert/private'
  private_request = requests.post(private_url, headers=auth_headers, params=private_link)
  print(f"Requested link creation via {private_url}: {private_request.json()}")

  # make a request to the logout endpoint so that the auth token is invalidated
  logout_url = f'{protocol}://{url}:{port}/api/logout/'
  logout_request = requests.post(logout_url, headers=auth_headers)
  print(f"Logged out via {logout_url}: {logout_request.json()}")
else:
  print("Error logging in")