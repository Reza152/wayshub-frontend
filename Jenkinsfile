pipeline {
    agent any

    stages {
        stage('Build & Deploy') {
            steps {
                echo 'Building WaysHub-Frontend...'
                // Sesuaikan steps build & deploy lu di sini
            }
        }
    }

    post {
        success {
            script {
                def webhookUrl = 'https://discord.com/api/webhooks/1547146694569893911/ktPHbF2-M16wIgvGbQclZgIiR23v5p3D9aH5Mu_gJggeOBoG9UWRZhSsdwMAN3LXt4Eq'
                def payload = """
                {
                  "embeds": [
                    {
                      "title": "Jenkins Build SUCCESS",
                      "description": "wayshub-frontend berhasil di-build & deploy.",
                      "color": 3066993
                    }
                  ]
                }
                """
                sh "curl -H 'Content-Type: application/json' -d '${payload}' '${webhookUrl}'"
            }
        }
        failure {
            script {
                def webhookUrl = 'https://discord.com/api/webhooks/1547146694569893911/ktPHbF2-M16wIgvGbQclZgIiR23v5p3D9aH5Mu_gJggeOBoG9UWRZhSsdwMAN3LXt4Eq'
                def payload = """
                {
                  "embeds": [
                    {
                      "title": "Jenkins Build FAILED",
                      "description": "wayshub-frontend gagal di-build & deploy.",
                      "color": 15158332
                    }
                  ]
                }
                """
                sh "curl -H 'Content-Type: application/json' -d '${payload}' '${webhookUrl}'"
            }
        }
    }
}
