pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Reza152/wayshub-frontend.git'
            }
        }

        stage('Check Staging Directory') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'wayshub-ssh-key', 
                    keyFileVariable: 'SSH_KEY', 
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $SSH_KEY $SSH_USER@172.31.15.141 "ls -la ~/staging-wayshub"
                    '''
                }
            }
        }
    }
}
