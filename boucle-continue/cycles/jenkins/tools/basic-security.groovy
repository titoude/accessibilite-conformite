import jenkins.model.*
import hudson.security.*

def instance = Jenkins.getInstance()

def hudsonRealm = new HudsonPrivateSecurityRealm(false)
hudsonRealm.createAccount("admin", "jk42-admin-pw")
instance.setSecurityRealm(hudsonRealm)

def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
strategy.setAllowAnonymousRead(false)
instance.setAuthorizationStrategy(strategy)

instance.save()

// le SetupWizard reste actif sur un home frais même avec une sécurité
// configurée par hook — on le marque comme terminé explicitement.
instance.setInstallState(jenkins.install.InstallState.INITIAL_SETUP_COMPLETED)

println "cycle42: admin/admin security initialisée"
