// seed.groovy — cycle 42 jenkins. Exécuté via POST /scriptText (admin).
// Idempotent : chaque entité est recréée/mise à jour sans doublon.
import jenkins.model.*
import hudson.model.*
import hudson.tasks.Shell
import hudson.security.HudsonPrivateSecurityRealm
import com.cloudbees.hudson.plugins.folder.Folder
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.domains.Domain
import com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl
import org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl
import com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey
import hudson.util.Secret

def j = Jenkins.getInstance()

// ---- utilisateurs ----
def realm = j.getSecurityRealm()
if (realm instanceof HudsonPrivateSecurityRealm) {
  if (User.getById('alice', true) == null) realm.createAccount('alice', 'alice-jk42-pw')
  if (User.getById('bob', true) == null) realm.createAccount('bob', 'bob-jk42-pw')
}

// ---- jobs freestyle ----
def mkFree = { name, desc, cmd ->
  def p = j.getItem(name) ?: j.createProject(FreeStyleProject.class, name)
  p.setDescription(desc)
  p.getBuildersList().clear()
  p.getBuildersList().add(new Shell(cmd))
  p.save()
  p
}

def webapp = mkFree('webapp-deploy', 'Deploiement application web (staging/prod)', 'echo "deploy $ENV sur $BRANCH" && sleep 1 && echo done')
webapp.removeProperty(ParametersDefinitionProperty.class)
webapp.addProperty(new ParametersDefinitionProperty(
  new StringParameterDefinition('BRANCH', 'main', 'Branche git a deployer'),
  new ChoiceParameterDefinition('ENV', ['staging', 'prod'] as String[], 'Environnement cible'),
  new BooleanParameterDefinition('DEBUG', false, 'Activer le mode debug')))
webapp.save()

mkFree('docs-build', 'Generation de la documentation', 'echo "build docs" && mkdir -p reports')
def failing = mkFree('nightly-backup', 'Sauvegarde nocturne des artefacts', 'echo "backup start" && exit 1')

// ---- dossier + job imbrique ----
def folder = j.getItem('services') ?: j.createProject(Folder.class, 'services')
folder.setDescription('Services internes')
def innerJob = folder.getItem('worker-queue') ?: folder.createProject(FreeStyleProject.class, 'worker-queue')
innerJob.setDescription('Traitement de la file de messages')
innerJob.getBuildersList().clear()
innerJob.getBuildersList().add(new Shell('echo "queue drained"'))
innerJob.save()

// ---- pipelines ----
def mkPipe = { name, desc, script ->
  def p = j.getItem(name) ?: j.createProject(WorkflowJob.class, name)
  p.setDescription(desc)
  p.setDefinition(new CpsFlowDefinition(script, true))
  p.save()
  p
}
mkPipe('api-pipeline', "Pipeline de l'API principale", '''
pipeline { agent any
  stages {
    stage('Build') { steps { echo "compile" } }
    stage('Test')  { steps { echo "unit tests" } }
    stage('Deploy'){ steps { echo "deploy" } }
  }
}''')
mkPipe('release-pipeline', 'Pipeline de release', '''
pipeline { agent any
  stages { stage('Package') { steps { echo "package" } } }
}''')

// ---- credentials (store system, domaine global) ----
def store = SystemCredentialsProvider.getInstance().getStore()
def dom = Domain.global()
def hasCred = { cid -> store.getCredentials(dom).any { it.id == cid } }
if (!hasCred('github-token'))   store.addCredentials(dom, new UsernamePasswordCredentialsImpl(CredentialsScope.GLOBAL, 'github-token', 'Token GitHub CI', 'ci-bot', 'ghp_seedtoken123'))
if (!hasCred('registry-creds')) store.addCredentials(dom, new UsernamePasswordCredentialsImpl(CredentialsScope.GLOBAL, 'registry-creds', 'Registry Docker interne', 'deploy-bot', 'regpw'))
if (!hasCred('slack-webhook'))  store.addCredentials(dom, new StringCredentialsImpl(CredentialsScope.GLOBAL, 'slack-webhook', 'Webhook Slack notifications', Secret.fromString('https://hooks.example/seed')))
if (!hasCred('deploy-ssh'))     store.addCredentials(dom, new BasicSSHUserPrivateKey(CredentialsScope.GLOBAL, 'deploy-ssh', 'deployer', new BasicSSHUserPrivateKey.UsersPrivateKeySource(), '', 'Cle SSH de deploiement'))

// ---- vue liste ----
if (j.getView('release') == null) {
  def v = new hudson.model.ListView('release')
  j.addView(v)
  v.add(j.getItem('release-pipeline'))
}

// ---- builds executes ----
def runAndWait = { Job job, Action[] acts ->
  def f = (acts != null) ? job.scheduleBuild2(0, new Cause.UserIdCause(), acts) : job.scheduleBuild2(0)
  if (f != null) { f.get() }   // attend la fin du build
}
runAndWait(webapp, null)
runAndWait(webapp, new ParametersAction([new StringParameterValue('ENV', 'prod'), new BooleanParameterValue('DEBUG', true)]))
runAndWait(j.getItem('docs-build'), null)
runAndWait(failing, null)
runAndWait(innerJob, null)
runAndWait(j.getItem('api-pipeline'), null)
runAndWait(j.getItem('api-pipeline'), null)
runAndWait(j.getItem('release-pipeline'), null)

println 'SEED_DONE jobs=' + j.getAllItems(Job.class).size() + ' creds=' + store.getCredentials(dom).size()
