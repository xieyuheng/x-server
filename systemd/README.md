# Example systemd services

## Usage

Install service:

```
sudo cp <name>.service /etc/systemd/system/
```

Using service:

```
sudo systemctl start <name>.service
sudo systemctl enable <name>.service
sudo systemctl status <name>.service
```

To view log:

```
journalctl -f -u <name>.service
```

Reload systemd config files:

```
systemctl daemon-reload
```

## Note

Note that systemd services will be ran by the root user,
thus if we are not the root user,
when doing `fidb reverse-proxy:login`,
we should add `sudo` to login for the root user
-- `sudo fidb reverse-proxy:login`.
