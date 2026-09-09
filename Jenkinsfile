pipeline {
    agent any

    environment {
        DOCKER_CREDS = credentials('docker-hub-credentials')
        IMAGE_NAME = 'reza1019/wayshub-frontend'
        TAG = 'staging'
        DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1547146694569893911/ktPHbF2-M16wIgvGbQclZgIiR23v5p3D9aH5Mu_gJggeOBoG9UWRZhSsdwMAN3LXt4Eq'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('2. Build & Dockerize') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${TAG} ."
                }
            }
        }

        stage('3. Push to Docker Hub') {
            steps {
                script {
                    sh 'echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin'
                    sh "docker push ${IMAGE_NAME}:${TAG}"
                }
            }
        }

        stage('4. Auto Deploy') {
            steps {
                sh '''
                    cd ~/staging-wayshub
                    docker compose pull frontend
                    docker compose up -d --no-deps staging_frontend
                '''
            }
        }
    }

    post {
        success {
            script {
                sh '''
                    curl -H "Content-Type: application/json" \
                    -X POST \
                    -d '{"embeds": [{"description": "wayshub-frontend berhasil di-build dan deploy.", "color": 3066993}]}' \
                    ${DISCORD_WEBHOOK}
                '''
            }
        }
        failure {
            script {
                sh '''
                    curl -H "Content-Type: application/json" \
                    -X POST \
                    -d '{"embeds": [{"description": "⚠️ GAGAL! wayshub-frontend gagal di-build atau deploy.", "color": 15158332}]}' \
                    ${DISCORD_WEBHOOK}
                '''
            }
        }
    }
}
