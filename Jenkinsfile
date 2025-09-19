// Jenkins Pipeline for BoycottPro React Native UI
// This pipeline handles boycottproui - builds APK/IPA for manual store upload

pipeline {
    agent any

    tools {
        nodejs 'NodeJS-18'
    }

    parameters {
        choice(
            name: 'BUILD_TYPE',
            choices: ['development', 'staging', 'production'],
            description: 'Build type for React Native app'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip unit tests (emergency builds only)'
        )
        booleanParam(
            name: 'BUILD_ANDROID',
            defaultValue: true,
            description: 'Build Android APK for Play Store'
        )
        booleanParam(
            name: 'BUILD_IOS',
            defaultValue: false,
            description: 'Build iOS for App Store (requires macOS)'
        )
    }

    environment {
        APP_NAME = "boycottproui"
        NODE_ENV = "${params.BUILD_TYPE}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    # Clean install to ensure fresh dependencies (with legacy peer deps for React 19 compatibility)
                    npm ci --legacy-peer-deps

                    # Install React Native CLI if not present
                    npm install -g @react-native-community/cli || true
                '''
            }
        }

        stage('Test') {
            when {
                expression { !params.SKIP_TESTS }
            }
            steps {
                script {
                    try {
                        sh '''
                            # Run Jest tests with coverage
                            npm test -- --coverage --watchAll=false --passWithNoTests
                        '''
                        echo "✅ Tests completed successfully"
                    } catch (Exception e) {
                        echo "⚠️ Tests failed but continuing build: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
            post {
                always {
                    script {
                        try {
                            publishHTML([
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Jest Coverage Report'
                            ])
                            echo "✅ Coverage report published"
                        } catch (Exception e) {
                            echo "⚠️ Failed to publish coverage report: ${e.getMessage()}"
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { !params.SKIP_TESTS }
            }
            steps {
                script {
                    try {
                        withSonarQubeEnv('Local-SonarQube') {
                            sh '''
                                # Create sonar-project.properties if it doesn't exist
                                if [ ! -f sonar-project.properties ]; then
                                    cat > sonar-project.properties << EOF
sonar.projectKey=${APP_NAME}
sonar.projectName=${APP_NAME}
sonar.projectVersion=${GIT_COMMIT_SHORT}
sonar.sources=src
sonar.exclusions=**/*.test.tsx,**/*.test.ts,**/node_modules/**,**/coverage/**
sonar.typescript.lcov.reportPaths=coverage/lcov.info
EOF
                                fi

                                # Run SonarQube scanner
                                sonar-scanner
                            '''
                        }
                        echo "✅ SonarQube analysis completed successfully"
                    } catch (Exception e) {
                        echo "⚠️ SonarQube analysis failed but continuing build: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Build Store-Ready Apps') {
            parallel {
                stage('Android APK for Play Store') {
                    when {
                        expression { params.BUILD_ANDROID }
                    }
                    steps {
                        sh '''
                            cd android

                            # Make gradlew executable (fix permission denied error)
                            chmod +x gradlew

                            # Clean previous builds
                            ./gradlew clean

                            # Build release APK for Play Store
                            ./gradlew assembleRelease

                            # Copy APK to store-ready artifacts
                            mkdir -p ../store-ready/android
                            cp app/build/outputs/apk/release/*.apk ../store-ready/android/${APP_NAME}-playstore-${GIT_COMMIT_SHORT}.apk

                            echo "✅ Android APK ready for Google Play Store upload!"
                        '''
                    }
                }

                stage('iOS IPA for App Store') {
                    when {
                        allOf {
                            expression { params.BUILD_IOS }
                            expression { isUnix() && sh(script: 'uname', returnStdout: true).trim() == 'Darwin' }
                        }
                    }
                    steps {
                        sh '''
                            cd ios

                            # Install CocoaPods dependencies
                            pod install

                            # Build iOS archive for App Store
                            xcodebuild -workspace ${APP_NAME}.xcworkspace \
                                -scheme ${APP_NAME} \
                                -configuration Release \
                                -archivePath ../store-ready/ios/${APP_NAME}-appstore.xcarchive \
                                archive

                            echo "✅ iOS archive ready for App Store upload!"
                        '''
                    }
                }
            }
        }

        stage('Package Store Assets') {
            steps {
                sh '''
                    # Create store-ready package
                    mkdir -p deployment/store-ready

                    if [ -d "store-ready/android" ]; then
                        cp store-ready/android/*.apk deployment/store-ready/
                        echo "📦 Android APK packaged for Play Store"
                    fi

                    if [ -d "store-ready/ios" ]; then
                        cp -r store-ready/ios/* deployment/store-ready/
                        echo "📦 iOS archive packaged for App Store"
                    fi

                    # Create upload instructions
                    cat > deployment/STORE_UPLOAD_INSTRUCTIONS.md << EOF
# Store Upload Instructions

## Google Play Store (Android)
1. Go to https://play.google.com/console
2. Select your app: ${APP_NAME}
3. Navigate to Release Management > App Releases
4. Upload: ${APP_NAME}-playstore-${GIT_COMMIT_SHORT}.apk
5. Complete store listing and submit for review

## Apple App Store (iOS)
1. Use Xcode or Transporter app
2. Upload: ${APP_NAME}-appstore.xcarchive
3. Go to https://appstoreconnect.apple.com
4. Complete app information and submit for review

Build Info:
- Version: ${GIT_COMMIT_SHORT}
- Build Type: ${BUILD_TYPE}
- Date: $(date)
EOF

                    echo "✅ Store-ready packages created!"
                '''

                archiveArtifacts artifacts: 'deployment/**/*', fingerprint: true
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "✅ React Native build successful and ready for store upload!"
            script {
                if (params.BUILD_ANDROID) {
                    echo "📱 Android APK ready: ${APP_NAME}-playstore-${env.GIT_COMMIT_SHORT}.apk"
                    echo "🏪 Upload to: https://play.google.com/console"
                }
                if (params.BUILD_IOS) {
                    echo "📱 iOS archive ready: ${APP_NAME}-appstore.xcarchive"
                    echo "🏪 Upload to: https://appstoreconnect.apple.com"
                }
            }
        }
        failure {
            emailext (
                subject: "FAILED: React Native Store Build - ${APP_NAME}",
                body: "React Native store-ready build failed for ${APP_NAME}. Check Jenkins for details.",
                to: "dylan@kesslersoftware.com"
            )
        }
    }
}