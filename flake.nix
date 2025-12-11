{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-25.05";
  };

  outputs = { self, nixpkgs }:
		let 
				system = "x86_64-linux";
				pkgs = import nixpkgs { inherit system; };
		in {
			devShells.${system}.default = with pkgs; mkShellNoCC {
				buildInputs = [
						php
						nodejs
						pkgs.phpPackages.composer
						mysql-client
				];
			};
		};
}
