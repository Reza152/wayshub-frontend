pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Reza152/wayshub-frontend.git'
            }
        }

        stage('Deploy Frontend to Staging') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'wayshub-ssh-key', 
                    keyFileVariable: 'SSH_KEY', 
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $SSH_KEY $SSH_USER@172.31.15.141 "
                            mkdir -p ~/staging-wayshub/wayshub-frontend &&
                            cd ~/staging-wayshub/wayshub-frontend &&
                            git pull origin main || git clone https://github.com/Reza152/wayshub-frontend.git . &&
                            docker compose up -d --build
                        "
                    '''
                }
            }
        }
    }

    post {
        success {
            withCredentials([string(credentialsId: 'DISCORD_WEBHOOK_URL', variable: 'WEBHOOK_URL')]) {
                sh '''
                    curl -H "Content-Type: application/json" \
                    -X POST \
                    -d '{"content": "✅ wayshub-frontend berhasil di-build dan deploy."}' \
                    $WEBHOOK_URL
                '''
            }
        }
        failure {
            withCredentials([string(credentialsId: 'DISCORD_WEBHOOK_URL', variable: 'WEBHOOK_URL')]) {
                sh '''
                    curl -H "Content-Type: application/json" \
                    -X POST \
                    -d '{"content": "❌ wayshub-frontend gagal di-build atau deploy!"}' \
                    $WEBHOOK_URL
                '''
            }
        }
    }
}
