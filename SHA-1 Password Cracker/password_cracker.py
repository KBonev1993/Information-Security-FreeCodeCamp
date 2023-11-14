import hashlib


def crack_sha1_hash(hash, use_salts=False):

  def hash_password(password):
    return hashlib.sha1(password.encode()).hexdigest()

  # Load the top 10,000 passwords
  with open("top-10000-passwords.txt", "r") as file:
    passwords = file.read().splitlines()

  # Optionally load salts
  salts = []
  if use_salts:
    with open("known-salts.txt", "r") as file:
      salts = file.read().splitlines()

  # Attempt to crack the hash
  for password in passwords:
    if use_salts:
      for salt in salts:
        # Check with the salt prepended
        if hash_password(salt + password) == hash:
          return password
        # Check with the salt appended
        if hash_password(password + salt) == hash:
          return password
    else:
      if hash_password(password) == hash:
        return password

  return "PASSWORD NOT IN DATABASE"


# Example usage
print(crack_sha1_hash(
    "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8"))  # Should return "password"
