#!/bin/bash

if command -v npm >/dev/null 2>&1; then
        echo "nvm already installed"
    else
		unset NVM_DIR
		curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
		mv $HOME/.nvm /goinfre/$USER
		#echo 'export NVM_DIR="/goinfre/$USER/.nvm"
		#[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
		#[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> $HOME/.zshrc
		source $HOME/.zshrc
		nvm install --lts
		npm install -g typescript
		npm i -g @nestjs/cli
		echo "*************** DONE ! ***************"
fi
