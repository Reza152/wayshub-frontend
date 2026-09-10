pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Deploy Frontend to Staging VM') {
            steps {
                script {
                    sh """
                        echo '=== Mengirim file frontend ke VM Backend (staging-wayshub) ==='
                        rsync -avz -e 'ssh -o StrictHostKeyChecking=no' ./ reza@172.31.15.141:~/staging-wayshub/wayshub-frontend/

                        echo '=== Menjalankan Docker Compose Staging Frontend & Nginx ==='
                        ssh -o StrictHostKeyChecking=no reza@172.31.15.141 "cd ~/staging-wayshub && docker compose down && docker compose up -d --build"
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Frontend Berhasil!'
        }
        failure {
            echo 'Deployment Frontend Gagal, Cek console output.'
        }
    }
}
