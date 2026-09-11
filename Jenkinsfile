pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        DISCORD_WEBHOOK_ID = 'DISCORD_WEBHOOK_URL'
        IMAGE_NAME = 'reza1019/wayshub-frontend:latest'
    }

    stages {
        stage('Pull from SCM') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Dockerize & Build') {
            steps {
                echo 'Building Docker image for Frontend...'
                script {
                    app = docker.build("${IMAGE_NAME}")
                }
            }
        }

        stage('Test Application') {
            steps {
                echo 'Running application smoke test...'
                script {
                    sh 'docker run -d -p 3000:80 --name test-frontend-container ${IMAGE_NAME}'
                    sh 'sleep 3 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -E "200|302|404" || exit 1'
                    sh 'docker rm -f test-frontend-container'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing image to Docker Hub...'
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        app.push()
                    }
                }
            }
        }

        stage('Deploy on top Docker') {
            steps {
                echo 'Deploying frontend container...'
                sh '''
                    docker pull ${IMAGE_NAME}
                    docker stop production_frontend || true
                    docker rm production_frontend || true
                    docker run -d \
                      --name production_frontend \
                      -p 80:80 \
                      --restart always \
                      ${IMAGE_NAME}
                '''
            }
        }
    }

    post {
        success {
            script {
                withCredentials([string(credentialsId: "${DISCORD_WEBHOOK_ID}", variable: 'DISCORD_WEBHOOK')]) {
                    sh '''
                        curl -H "Content-Type: application/json" \
                        -X POST \
                        -d '{"content": "✅ **JENKINS SUCCESS**: Frontend WaysHub successfully built, tested, and deployed!"}' \
                        $DISCORD_WEBHOOK
                    '''
                }
            }
        }
        failure {
            script {
                withCredentials([string(credentialsId: "${DISCORD_WEBHOOK_ID}", variable: 'DISCORD_WEBHOOK')]) {
                    sh '''
                        curl -H "Content-Type: application/json" \
                        -X POST \
                        -d '{"content": "❌ **JENKINS FAILED**: Frontend WaysHub CI/CD Pipeline encountered an error."}' \
                        $DISCORD_WEBHOOK
                    '''
                }
            }
        }
    }
}
