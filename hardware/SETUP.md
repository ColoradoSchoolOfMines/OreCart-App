
# Environment Setup

It is recommended to complete the setup with [VS Code](#visual-studio-code), but it can also be completed with the command-line tools.

## Visual Studio Code
Install the [nRF Connect Extension Pack](https://marketplace.visualstudio.com/items?itemName=nordic-semiconductor.nrf-connect-extension-pack), this will prompt you to install the nRF toolchain and SDK (both of which are necessary). This project currently uses SDK/toolchain version 2.4.2.

Once this has been installed, the repo can be opened with VS Code. Then open the nRF Connect tab (on the left side).
> **_NOTE:_**  If you have the CMake extension installed, it may be worth disabling it for this project, since it conflicts with the Intellisense provided by the nRF Connect SDK. This can be done by clicking on the gear icon next to the "CMake Tools" extensions and clicking on `Disable (Workspace)`. VS Code will need to be reloaded.

Once installed:
1. Click on "Create new build configuration"
2. Select "sparkfun_thing_plus_nrf9160_ns" (ns stands for non-secure, which we will use for development).
3. Click on "Build Configuration," this should build the project.

Now that the project has been built, jump to [Flashing the Board](#flashing-the-board).

## Command-line Tools
The SDK can also be installed manually, and the `west` command-line tool can also be invoked without using VS Code.
Instructions will be added later.

# Flashing the Board

## Installing Newtmgr

Flashing the board requires the newtmgr utility which can be obtained by following the system-specific instructions below:

### MacOS (x86_64)
If you're on a newer version of MacOS, you'll need to install the drivers for UART. They can be found [here](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads).

Then execute the following, this will download the newtmgr binary and move it your `bin` directory.
```
wget "https://docs.jaredwolff.com/files/newtmgr/darwin/newtmgr.zip"
unzip newtmgr.zip
mv newtmgr /usr/local/bin
rm newtmgr.zip
```

Next, we'll add a profile for our board:

```
newtmgr conn add serial type=serial connstring='dev=/dev/tty.SLAB_USBtoUART,baud=1000000'
```

### Linux (x86_64)

Execute the following, this will download the newtmgr binary and move it your `bin` directory.

```
wget "https://docs.jaredwolff.com/files/newtmgr/linux/newtmgr.zip"
unzip newtmgr.zip
mv newtmgr ~/.local/bin
rm newtmgr.zip
```

To add the profile for the USB device, execute the following. This assumes that the board is connected to ttyUSB0, which should be the case if no other serial devices are present. If multiple serial devices are connected, the correct ttyUSB device will need to be found.
```
newtmgr conn add serial type=serial connstring='dev=/dev/ttyUSB0,baud=1000000'
```

### Windows (x86_64)
> **_NOTE:_** If you are using WSL, you may follow the Linux instructions instead, but you'll need to pass through the USB device to WSL. Please follow the instructions [here](https://blog.golioth.io/program-mcu-from-wsl2-with-usb-support/).

[Download the Newtmgr program](https://docs.jaredwolff.com/files/newtmgr/windows/newtmgr.zip) and extract the single file instead to `C:\Users\<your username>\ncs\v1.4.1\toolchain\bin.` Add this directory to your $PATH.

Finally, find the COM port that the Sparkfun board is connected to (using Device Manager, or any other utility), and rewrite the following command with the correct COM number.

```
newtmgr conn add serial type=serial connstring="dev=COM3,baud=1000000"
```

### MacOS/Linux/Windows (ARM64)
This architecture requires [Building from Source](#buiding-from-source).

### Buiding from Source
If you would prefer to build the newtmgr project yourself (if you are running an unsupported architecture, for example), you may clone the [newtmgr repo](https://github.com/apache/mynewt-newtmgr), and then build the project yourself.

Note that this project is written in Golang, so you'll need to have that installed before building.

## Using Newtmgr
Once the project has been built successfully (see [Environment Setup](#environment-setup)), your "build/zephyr/" directory should contain a file named "app_update.bin." This is what we will use to flash the board.

Making sure the board is plugged in to your machine, hold down the Mode (MD) button, and then press Reset (RST) whilst keeping Mode held down. The blue LED should light up. 

Next we will execute the following to finally flash the board.

```
newtmgr -c serial image upload build/zephyr/app_update.bin 
newtmgr -c serial reset
```

The first command actually flashes the ROM of the board, while the second resets the board so the project is actually executed.

### Connecting to the board using minicom

#### Windows

Install WSL Then follow the Linux install instructions below for your WSL install.

#### Linux

Follow the install for your distro's package manager.

(Nix OS)[https://mynixos.com/nixpkgs/package/minicom]
(ArchLinux)[https://security.archlinux.org/package/minicom]
(Ubuntu)[https://help.ubuntu.com/community/Minicom]
(Debian)[https://packages.debian.org/search?keywords=minicom]

#### What command to use

`-D` - specifies the port
`-b` - specifies the baud rate

```
minicom -D /dev/ttyUSB0 -b 15200
```

#### Disconnecting

Press Ctrl A, Then press Q, Select yes, Pray your terminal comes back :3

# Developing without a board

This can be done with the POSIX target.
*IMPORTANT*: You need to run `/ncs/v2.4.2/tools/net-tools/net-setup.sh` in order to setup networking.

# FAQs
## Why doesn't the Zephyr Connect extension detect/flash the board?
This extension was designed for the nRF9160 Development Kit (DK).

Our dev board uses MCUBoot, so that we don't need the more expensive DK, and so requires a different utility (newtmgr to flash).

## Additional Setup Problems?
Sparkfun contains all of the documentation above, and goes a little more in-depth.
It can be found (here)[https://learn.sparkfun.com/tutorials/nrf9160-thing-plus-hookup-guide/all#programming-and-debugging].
