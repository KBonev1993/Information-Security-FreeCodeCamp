  import socket
  import ipaddress
  from common_ports import ports_and_services

  def get_open_ports(target, port_range, verbose=False):
      open_ports = []

      # Resolve the target to an IP address
      try:
          ip = socket.gethostbyname(target)
      except socket.gaierror:
          return "Error: Invalid hostname"

      # Validate IP address
      try:
          ipaddress.ip_address(ip)
      except ValueError:
          return "Error: Invalid IP address"

      # Scan ports in the specified range
      for port in range(port_range[0], port_range[1] + 1):
          with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
              s.settimeout(1)
              if s.connect_ex((ip, port)) == 0:
                  open_ports.append(port)

      # Verbose output
      if verbose:
          result = f"Open ports for {target} ({ip})\nPORT     SERVICE\n"
          for port in open_ports:
              service = ports_and_services.get(port, "Unknown")
              result += f"{port:<9}{service}\n"
          return result

      return open_ports
