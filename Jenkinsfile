pipeline {
    agent any

    stages {
        stage('Build & Deploy') {
            steps {
                echo 'Building WaysHub-Frontend...'
                // Tambahkan perintah build/deploy lu di sini jika ada
            }
        }
    }

    post {
        success {
            script {
                withCredentials([string(credentialsId: 'DISCORD_WEBHOOK_URL', variable: 'WEBHOOK_URL')]) {
                    def payload = """
                    {
                      "username": "Jenkins",
                      "avatar_url": "https://www.jenkins.io/images/logos/jenkins/jenkins.png",
                      "embeds": [
                        {
                          "title": "Jenkins Build SUCCESS",
                          "description": "wayshub-frontend berhasil di-build & deploy.",
                          "color": 3066993
                        }
                      ]
                    }
                    """
                    sh "curl -H 'Content-Type: application/json' -d '${payload}' '${WEBHOOK_URL}'"
                }
            }
        }
        failure {
            script {
                withCredentials([string(credentialsId: 'DISCORD_WEBHOOK_URL', variable: 'WEBHOOK_URL')]) {
                    def payload = """
                    {
                      "username": "Jenkins",
                      "avatar_url": "https://www.jenkins.io/images/logos/jenkins/jenkins.png",
                      "embeds": [
                        {
                          "title": "Jenkins Build FAILED",
                          "description": "wayshub-frontend gagal di-build & deploy.",
                          "color": 15158332
                        }
                      ]
                    }
                    """
                    sh "curl -H 'Content-Type: application/json' -d '${payload}' '${WEBHOOK_URL}'"
                }
            }
        }
    }
}
