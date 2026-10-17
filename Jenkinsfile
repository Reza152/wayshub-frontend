pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Deploy Frontend') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'wayshub-ssh-key',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        set -eu

                        ssh -o BatchMode=yes \
                            -o ConnectTimeout=10 \
                            -o StrictHostKeyChecking=accept-new \
                            -i "$SSH_KEY" \
                            "$SSH_USER@172.31.10.23" '
                                set -eu
                                cd /home/ubuntu/wayshub/frontend/source
                                git pull --ff-only origin main

                                cd /home/ubuntu/wayshub
                                sudo -n docker compose config -q
                                sudo -n docker compose up -d --build frontend
                                sudo -n docker compose ps frontend
                            '
                    '''
                }
            }
        }
    }
}
