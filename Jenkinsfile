pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Reza152/wayshub-frontend.git'
            }
        }

        stage('Deploy Backend to Staging') {
            steps {
                sshagent(['ssh-backend-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no reza@172.31.15.141 "
                            cd ~/wayshub-frontend &&
                            git pull origin main &&
                            docker compose up -d --build
                        "
                    '''
                }
            }
        }
    }

    post {
        success {
            // Panggil webhook pakai credentials Jenkins, bukan ditulis mentah
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
                    -d '{"content": "❌ wayshub- frontend gagal di-build atau deploy!"}' \
                    $WEBHOOK_URL
                '''
            }
        }
    }
}
