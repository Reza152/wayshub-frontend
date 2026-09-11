pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        IMAGE_NAME = 'reza1019/wayshub-frontend:latest'
        DISCORD_WEBHOOK_URL = credentials('DISCORD_WEBHOOK_URL')
        VM_SSH_CREDENTIAL_ID = 'wayshub-ssh-key' 
        VM_HOST = '172.31.15.141'
        VM_USER = 'reza'
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
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Test Application') {
            steps {
                echo 'Running application smoke test...'
                sh """
                    docker run -d -p 3000:80 --name test-frontend-container ${IMAGE_NAME}
                    sleep 3
                    curl --fail http://localhost:3000 || exit 1
                    docker rm -f test-frontend-container
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing image to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo '${DOCKER_PASS}' | docker login -u '${DOCKER_USER}' --password-stdin"
                    sh "docker push ${IMAGE_NAME}"
                }
            }
        }

        stage('Deploy on top Docker (VM 2 via SSH)') {
            steps {
                echo 'Deploying frontend container to VM 2 via SSH...'
                sshagent(credentials: ["${VM_SSH_CREDENTIAL_ID}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} '\
                            docker pull ${IMAGE_NAME} && \
                            docker stop production_frontend || true && \
                            docker rm production_frontend || true && \
                            docker run -d \
                              --name production_frontend \
                              -p 3000:80 \
                              --restart always \
                              ${IMAGE_NAME} \
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            script {
                sh '''
                    curl -H "Content-Type: application/json" \
                    -X POST \
                    -d '{"content": "✅ **JENKINS SUCCESS**: Frontend WaysHub successfully built, tested, and deployed to VM 2!"}' \
                    "$DISCORD_WEBHOOK_URL"
                '''
            }
        }
        failure {
            script {
                sh '''
                    curl -H "Content-Type: application/json" \
                    -X POST \
                    -d '{"content": "❌ **JENKINS FAILED**: Frontend WaysHub CI/CD Pipeline encountered an error."}' \
                    "$DISCORD_WEBHOOK_URL"
                '''
            }
        }
    }
}
