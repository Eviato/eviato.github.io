---
title: My dotfiles, from Windows to Omarchy
date: 2026-10-27
excerpt: Why I ended up on Arch Linux with Omarchy, how my dotfiles repo is laid out, and the exact steps for a fresh laptop or a full reinstall, with a separate encrypted partition that keeps my data safe.
tags: [Linux, Dotfiles, Omarchy]
---

> This post covers my personal workstation setup: how I got to Linux, why Arch and Omarchy, how my [dotfiles](https://github.com/Dawtio/dotfiles) are organised, and the two procedures I actually use: setting up a new laptop, and reinstalling the current one.

## How I got here

I started on Windows, like most people. About ten years ago I moved to macOS. It gave me a real Unix shell, a terminal I wanted to use, and a machine that mostly stayed out of my way.

Over the same period, Linux took over my working life. Every server, container, pipeline and cluster I touch for clients runs Linux. So I spent my days on Linux over SSH, then came home to a different OS with different tools and a different package manager. I eventually stopped putting up with that split. I now run Linux on my personal laptop too, so the system I work on and the system I work with are the same.

### Why Arch Linux

- **Full control.** Arch installs almost nothing by default. Everything on the machine is there because I, or a tool I chose, put it there. When something breaks, there are fewer layers to dig through.
- **Lightweight.** There's no preinstalled desktop suite and no background services I didn't ask for. It boots fast and stays fast.
- **Rolling release.** There's no big upgrade every two years, just small, frequent updates. The [Arch Wiki](https://wiki.archlinux.org) is the best Linux documentation there is, whatever distro you run.

### Why Omarchy

Plain Arch has a cost. You build the desktop yourself: compositor, bar, launcher, lock screen, theming, keybindings. I've done that before, and it's an excellent way to learn and a terrible way to spend a weekend you wanted for something else.

[Omarchy](https://omarchy.org) is an opinionated Arch + [Hyprland](https://hypr.land) setup. You get a complete, good-looking tiling desktop from one ISO, while it's still Arch underneath with pacman, the AUR and the wiki. My reasons for choosing it:

- **Simpler.** The defaults are sensible, so I start from a working desktop and only change what I care about.
- **Easy to configure.** Everything is plain text in `~/.config`. Themes, keybindings and monitors are a file edit plus a reload.
- **AI is part of the setup.** Omarchy treats coding agents as a normal part of the desktop. My default agent is Claude, and [mise](https://mise.jdx.dev) installs `claude`, `codex` and `opencode` next to Node. AI will be part of the job from here on, and I'd rather learn it on my own machine every day than read about it occasionally. That's also how I keep learning Linux itself: when I don't understand part of the system, I ask, then go read the source or the wiki.

## What are dotfiles, and why keep them

On Unix systems, user configuration lives in hidden files and folders, named with a leading dot: `~/.bashrc`, `~/.gitconfig`, `~/.config/nvim/`. Those are the *dotfiles*. A dotfiles repo is just those files under version control.

Why bother:

- **Reproducibility.** A new machine feels like mine within minutes, not after a week of "oh right, I had changed that too".
- **History.** Every tweak is a commit. When a change breaks something, `git log` shows when, and `git revert` undoes it.
- **Disaster recovery.** A dead SSD costs me a reinstall, not my setup.
- **Sharing.** Other people's dotfiles are some of the best documentation around. Mine are public under MIT; take whatever is useful.

## How the repo is structured

My previous dotfiles were a much bigger project: NixOS, Home Manager, flakes, a hand-built Hyprland. When I moved to Omarchy I started over, with one rule: **Omarchy already ships a polished desktop, so the repo only tracks the files I've actually changed.**

```
dotfiles/
├── install.sh          # symlinks everything into place
├── config/             # mirrors ~/.config
│   ├── hypr/           #   bindings, look & feel, monitors, input
│   ├── omarchy/        #   shell, themed templates, hooks, branding, backgrounds
│   ├── nvim/           #   full Neovim config (linked as a whole folder)
│   ├── alacritty/ foot/ ghostty/ kitty/
│   ├── fontconfig/ git/ mise/ opencode/ autostart/
│   ├── chromium-flags.conf
│   └── starship.toml
└── home/               # mirrors ~ (e.g. .bashrc)
```

The mapping is the entire design:

- `config/<path>` → `~/.config/<path>`
- `home/<path>` → `~/<path>`

There are no frameworks or dependencies, and no GNU Stow or chezmoi: one Bash script and a folder tree that mirrors `$HOME`.

### Files linked one by one

This is the main design choice. `~/.config/hypr/` contains Omarchy's own files *and* mine. If I symlinked the whole `hypr` folder to the repo, I'd have to track every Omarchy default as well, and every Omarchy update would conflict with it. So `install.sh` links **each file individually**, and my `bindings.lua` sits next to Omarchy's files without replacing them.

The exception is folders I own entirely. Neovim's config is mine from top to bottom, so it's listed in `LINK_DIRS` and linked as one folder:

```bash
LINK_DIRS=(config/nvim)
```

### The install script

`install.sh` walks `config/` and `home/` and, for each file:

- if the link already exists, it does nothing;
- if a regular file with **identical** content is there, it replaces it with the link;
- if a **different** file is there, it moves it aside as `<name>.bak-<timestamp>`, then links. Nothing is ever deleted.

It has three modes:

```bash
./install.sh --dry-run   # show what would happen
./install.sh             # do it
./install.sh --status    # check links + uncommitted changes
```

### Day to day

Since everything is a symlink, editing `~/.config/hypr/bindings.lua` edits the repo directly. I commit when I'm happy with a change.

One trap: some tools save by writing a *new* file instead of editing the existing one, which silently replaces the symlink with a regular file. The Omarchy shell does this to `shell.json` when I change the bar from the UI. `--status` catches it:

```
links: 27 ok, 0 to fix (run ./install.sh)
uncommitted changes:
 M config/hypr/bindings.lua
```

| Status | Meaning | Fix |
|---|---|---|
| `missing` | The link isn't in place yet | `./install.sh` |
| `unlinked` | A plain file is there, but its content matches the repo | `./install.sh` |
| `drift` | A plain file with **different** content replaced the link | Copy it into the repo, then `./install.sh` |

## The dedicated data partition

Dotfiles cover configuration. They don't cover *data*: my projects, documents, photos. For that I keep a separate partition, so the operating system can be wiped without touching my files.

![Disk layout: p3 is the EFI partition mounted on /boot. p5 is the LUKS2 + btrfs Omarchy root. Its keyfile unlocks p1 at boot, a 1 TB LUKS2 + btrfs DATA partition with one subvolume per folder, mounted on ~/Projects, ~/Documents, ~/Pictures, ~/Videos, ~/Music, ~/Downloads and ~/Work.](/blog/my-dotfiles-on-omarchy/data-partition.svg)

How it's set up:

- **Encrypted, like the root.** The partition is LUKS2 with btrfs inside, using zstd compression and `noatime`, the same as Omarchy's root.
- **No second password at boot.** LUKS supports several keyslots. Slot 0 holds a long passphrase that 1Password generated and stores; that's the recovery key. Slot 1 holds a random keyfile at `/etc/cryptsetup-keys.d/data.key`, on the already-encrypted root, and `/etc/crypttab` uses it to unlock the partition automatically. A copy of the keyfile is also stored in 1Password.
- **One btrfs subvolume per folder,** each mounted **directly** onto `~/<Folder>` from `/etc/fstab`. There are no symlinks or bind mounts, so every tool sees normal paths, and each folder can be snapshotted on its own. The top level is mounted at `/mnt/data` for admin work.
- **`nofail` on every mount,** so if the unlock fails, the machine still boots.
- **Data only, never configuration.** `~/.config` stays on the root. That keeps the partition portable: I could install another distro on the free space next to it, give it the same UID/GID (1000) and its own keyfile, and mount the same data from there.

The `/etc/fstab` entries look like this:

```
UUID=<fs-uuid>  /mnt/data               btrfs  noatime,compress=zstd,subvolid=5,nofail         0 0
UUID=<fs-uuid>  /home/mbrunet/Projects  btrfs  noatime,compress=zstd,subvol=@projects,nofail   0 0
UUID=<fs-uuid>  /home/mbrunet/Documents btrfs  noatime,compress=zstd,subvol=@documents,nofail  0 0
# ... same for Pictures, Videos, Music, Downloads, Work
```

And the `/etc/crypttab` entry:

```
data  UUID=<luks-uuid>  /etc/cryptsetup-keys.d/data.key  luks,discard
```

The dotfiles repo lives in `~/Projects/Dawtio/dotfiles`, which is **on the data partition**. That makes the reinstall procedure much shorter, as you'll see below.

## Case 1: fresh install on a new laptop

Nothing to recover here; the goal is to go from a blank machine to my environment.

### 1. Install Omarchy

Download the ISO from [omarchy.org](https://omarchy.org), flash it to a USB stick, boot it and follow the installer. [The Omarchy Manual](https://learn.omacom.io/2/the-omarchy-manual) covers each step. If you want a data partition, **leave unallocated space on the disk** for it.

### 2. Sign in to 1Password

Omarchy ships 1Password. Sign in, then enable:

- **Settings → Developer → Use the SSH agent**, so Git over SSH and commit signing work. My Git config signs commits with an SSH key through `op-ssh-sign`, with no GPG involved.
- **Settings → Developer → Integrate with 1Password CLI**, so `op` can read secrets for the next step.

### 3. Create the data partition (optional)

The short version, with the partition at `/dev/nvme0n1p1` (**check with `lsblk -f` first**; this wipes it):

```bash
# 1Password generates the recovery passphrase, so nobody types or sees it
op item create --category=password --vault=Private \
  --title="LUKS - DATA partition" \
  --generate-password='letters,digits,symbols,40'
KEY="op://Private/LUKS - DATA partition/password"

# Encrypt and open
sudo wipefs -a /dev/nvme0n1p1
op read -n "$KEY" | sudo cryptsetup luksFormat -q --type luks2 --label DATA_LUKS --key-file=- /dev/nvme0n1p1
op read -n "$KEY" | sudo cryptsetup open --key-file=- /dev/nvme0n1p1 data

# Keyfile for automatic unlock, backed up to 1Password
sudo install -d -m 0700 /etc/cryptsetup-keys.d
sudo dd if=/dev/urandom of=/etc/cryptsetup-keys.d/data.key bs=512 count=8
sudo chmod 0400 /etc/cryptsetup-keys.d/data.key
op read -n "$KEY" | sudo cryptsetup luksAddKey --key-file=- /dev/nvme0n1p1 /etc/cryptsetup-keys.d/data.key
sudo cat /etc/cryptsetup-keys.d/data.key \
  | op document create - --vault=Private --title="LUKS keyfile - DATA partition" --file-name=data.key

# Filesystem and subvolumes
sudo mkfs.btrfs -L DATA /dev/mapper/data
sudo mkdir -p /mnt/data && sudo mount /dev/mapper/data /mnt/data
for s in projects documents pictures videos music downloads work; do
  sudo btrfs subvolume create /mnt/data/@$s
done
sudo chown 1000:1000 /mnt/data/@*
```

`op read -n` matters: without `-n`, the trailing newline would become part of the LUKS key.

Then add the `crypttab` and `fstab` entries shown above (the UUIDs come from `lsblk -f`), and activate:

```bash
sudo systemctl daemon-reload && sudo mount -a
```

Reboot once to confirm the partition unlocks without a prompt and that `findmnt -t btrfs` lists every mount.

### 4. Clone and link the dotfiles

```bash
git clone git@github.com:Dawtio/dotfiles.git ~/Projects/Dawtio/dotfiles
cd ~/Projects/Dawtio/dotfiles
./install.sh --dry-run
./install.sh
```

### 5. Adapt what's machine-specific

Two files are specific to my machine and identity, so I edit them before going further:

- `config/hypr/monitors.lua`: monitor names, resolutions and layout (`hyprctl monitors all` lists them);
- `config/git/config`: name, email and signing key. Also recreate `~/.config/git/allowed_signers`, which isn't in the repo.

### 6. Finish

```bash
mise install      # claude, codex, opencode, node, from config/mise/config.toml
hyprctl reload    # pick up the Hyprland changes
nvim              # lazy.nvim bootstraps itself and installs the plugins
```

## Case 2: reinstall the same laptop

This is where the data partition pays off. The reinstall only touches the Omarchy root, so `~/Projects` (including the dotfiles repo), `~/Documents` and the rest are still there afterwards.

### Before wiping: what to back up

Everything below lives on the **root** partition, so the reinstall erases it:

| What | Why | How |
|---|---|---|
| Uncommitted dotfiles changes | Tools can replace links with plain files (the `drift` status) | `./install.sh --status`, copy back any drift, commit and push |
| `/etc/fstab` and `/etc/crypttab` lines | Needed to remount the data partition | Copy them to `~/Documents` (they're not secret) |
| The LUKS keyfile | Lets the new system unlock without the passphrase | Already in 1Password; check it still works (below) |
| `~/.config/git/allowed_signers` | Not tracked in the repo | Copy to `~/Documents`, or start tracking it |
| `~/.ssh/config`, `known_hosts`, any non-1Password keys | Lives in `~` on the root | Copy to `~/Documents` (keys only if encrypted) |
| List of installed packages | To reinstall what Omarchy doesn't ship | `pacman -Qqe > ~/Documents/pkglist.txt` |
| Anything else in `~` not on the data partition | Browser profiles, local app data | Check with `du -sh ~/.* 2>/dev/null` |

Then test that both 1Password copies still open the partition. Each command only succeeds if the key matches:

```bash
op read -n "op://Private/LUKS - DATA partition/password" \
  | sudo cryptsetup open --test-passphrase --key-file=- /dev/nvme0n1p1 && echo "passphrase OK"
op document get "LUKS keyfile - DATA partition" --vault=Private \
  | sudo cryptsetup open --test-passphrase --key-file=- /dev/nvme0n1p1 && echo "keyfile OK"
```

For extra safety, take a read-only btrfs snapshot of anything you can't afford to lose and copy it to an external disk with `btrfs send`. The plan is to never touch the data partition, but an installer pointed at the wrong partition will wipe it anyway.

### Reinstall

1. Boot the Omarchy ISO and install **onto the root partition only**. Never pick the whole disk, and double-check the target before confirming.
2. Sign in to 1Password and enable the SSH agent and CLI integration, as in case 1.
3. Restore the keyfile and remount the data partition:

```bash
sudo install -d -m 0700 /etc/cryptsetup-keys.d
op document get "LUKS keyfile - DATA partition" --vault=Private \
  | sudo tee /etc/cryptsetup-keys.d/data.key > /dev/null
sudo chmod 0400 /etc/cryptsetup-keys.d/data.key
```

Add the saved `crypttab` and `fstab` lines back, then run `sudo systemctl daemon-reload && sudo mount -a`. The partition wasn't touched, so its UUIDs and subvolumes are the same as before and mounting is all that's needed: no `mkfs`, no restoring data.

4. The dotfiles are already in `~/Projects/Dawtio/dotfiles`, so there's nothing to clone:

```bash
cd ~/Projects/Dawtio/dotfiles
./install.sh
mise install && hyprctl reload
```

5. Restore the few things from the backup list (`allowed_signers`, SSH config, extra packages with `pacman -S --needed - < ~/Documents/pkglist.txt` after removing anything you no longer want). Reboot once to confirm the automatic unlock.

## Wrapping up

The whole setup comes down to keeping three things separate:

- **The OS** (Omarchy on its own encrypted root) can be thrown away and reinstalled.
- **My configuration** (the dotfiles repo) is small, version-controlled and symlinked over Omarchy's defaults.
- **My data** (its own encrypted partition) is never touched by a reinstall.

The repo is at [github.com/Dawtio/dotfiles](https://github.com/Dawtio/dotfiles).
