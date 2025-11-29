let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-25.05";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in

pkgs.mkShellNoCC {
  packages = with pkgs; [
    vscodium
    php
    podman
    tmux
    pkgs.phpPackages.composer
    mysql-client
    podman
    nodejs
    dbeaver-bin
    lazygit
  ];

  shellHook = ''
  tmux new -s web-sys
  '';
}
