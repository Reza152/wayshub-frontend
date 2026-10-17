pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Pull from GitHub') {
            steps {
                checkout scm

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
                            '
                    '''
                }
            }
        }

        stage('Build Docker Image') {
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
                                cd /home/ubuntu/wayshub
                                sudo -n docker compose build frontend
                            '
                    '''
                }
            }
        }

        stage('Test Application') {
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
                                cleanup() {
                                    sudo -n docker rm -f wayshub-frontend-ci-test >/dev/null 2>&1 || true
                                }
                                trap cleanup EXIT

                                sudo -n docker rm -f wayshub-frontend-ci-test >/dev/null 2>&1 || true
                                sudo -n docker run -d \
                                    --name wayshub-frontend-ci-test \
                                    --network reza_network \
                                    -p 127.0.0.1:13000:3000 \
                                    reza1019/wayshub-frontend:latest >/dev/null

                                for attempt in 1 2 3 4 5 6 7 8 9 10; do
                                    if curl -fsS http://127.0.0.1:13000/ -o /dev/null; then
                                        echo "Frontend smoke test passed: HTTP 200"
                                        exit 0
                                    fi
                                    sleep 2
                                done

                                sudo -n docker logs wayshub-frontend-ci-test || true
                                echo "Frontend smoke test failed" >&2
                                exit 1
                            '
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DH_USER',
                        passwordVariable: 'DH_PASS'
                    ),
                    sshUserPrivateKey(
                        credentialsId: 'wayshub-ssh-key',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        printf '%s' "$DH_PASS" | ssh -o BatchMode=yes \
                            -o ConnectTimeout=10 \
                            -o StrictHostKeyChecking=accept-new \
                            -i "$SSH_KEY" \
                            "$SSH_USER@172.31.10.23" \
                            "sudo -n docker login --username '$DH_USER' --password-stdin"

                        ssh -o BatchMode=yes \
                            -o ConnectTimeout=10 \
                            -o StrictHostKeyChecking=accept-new \
                            -i "$SSH_KEY" \
                            "$SSH_USER@172.31.10.23" '
                                set -eu
                                cd /home/ubuntu/wayshub
                                sudo -n docker compose push frontend
                            '
                    '''
                }
            }
        }

        stage('Deploy Application') {
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
                                cd /home/ubuntu/wayshub
                                sudo -n docker compose pull frontend
                                sudo -n docker compose up -d --no-build --no-deps frontend
                                sudo -n docker compose ps frontend
                                sudo -n docker logout >/dev/null 2>&1 || true
                            '
                    '''
                }
            }
        }
    }

    post {
        success {
            withCredentials([string(
                credentialsId: 'DISCORD_WEBHOOK_URL',
                variable: 'WEBHOOK_URL'
            )]) {
                sh '''
                    set +x
                    curl -fsS -H "Content-Type: application/json" \
                        -X POST \
                        --data '{"content":"✅ Jenkins: WaysHub Frontend deployment SUCCESS"}' \
                        "$WEBHOOK_URL" >/dev/null
                '''
            }
        }

        failure {
            withCredentials([string(
                credentialsId: 'DISCORD_WEBHOOK_URL',
                variable: 'WEBHOOK_URL'
            )]) {
                sh '''
                    set +x
                    curl -fsS -H "Content-Type: application/json" \
                        -X POST \
                        --data '{"content":"❌ Jenkins: WaysHub Frontend pipeline FAILED"}' \
                        "$WEBHOOK_URL" >/dev/null
                '''
            }
        }
    }
}
