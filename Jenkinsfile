pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Reza152/wayshub-frontend.git'
            }
        }

        stage('Deploy Frontend Locally') {
            steps {
                sh '''
                    mkdir -p ~/staging-wayshub/wayshub-frontend &&
                    cp -r ./* ~/staging-wayshub/wayshub-frontend/ &&
                    cd ~/staging-wayshub &&
                    docker compose up -d --build wayshub-frontend
                '''
            }
        }
    }

    post {
        success {
            withCredentials([string(credentialsId: 'DISCORD_WEBHOOK_URL', variable: 'WEBHOOK_URL')]) {
                sh '''
                    curl -H "Content-Type: application/json" \
                    -X POST \
                    -d '{"content": "✅ wayshub-frontend berhasil di-build dan deploy secara lokal di gateway."}' \
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
