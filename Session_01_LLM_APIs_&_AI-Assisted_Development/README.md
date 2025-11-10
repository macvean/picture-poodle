<p align = "center" draggable=”false” ><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719" 
     width="200px"
     height="auto"/>
</p>

<h1 align="center" id="heading">Session 1: LLM APIs & AI-Assisted Development</h1>


| 🤓 Pre-Class | ⏺️ Recordings| 🖼️ Slide| 👨‍💻 Repos| 📄 Homework| 📁 Feedback| 
|:-----------------|:-----------------|:-----------------|:-----------------|:-----------------|:-----------------|
|[Prepare Kickoff](https://github.com/AI-Maker-Space/AIEO1/tree/main/01_Prepare_Session_01_Kickoff) | [Recording!](https://us02web.zoom.us/rec/share/9cXMOHbtujJmXM6ZZ9hDGBwP9SPBzPqK4mlH14gOSE8ZsYwMV6MgwxfDwV6aOE0F.WKWumY9-I3ZV-EXa) (h=@R43wL) | [Slides](https://www.canva.com/design/DAG3p9uenI0/KJC9xKEF2aWwiOkpoAanew/edit?utm_content=DAG3p9uenI0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton) | [Repo](https://github.com/AI-Maker-Space/AIEO1/tree/main/Session_01_LLM_APIs_%26_AI-Assisted_Development) | [HW #1](https://forms.gle/W7mzyne3YVE3HV2y6) | [Mon, Nov 3](https://forms.gle/rMm9xkeeMHQYD68RA) |

<p align="center"><img src="Gitflow_visualization.png" alt="Gitflow Visualization" width="800px" /></p>

## 🏗️ How AIM Does Assignments

> 📅 **Assignments will always be released to students as live class begins.** We will never release assignments early.

> **Assignments are voluntary** – Complete them at your own pace to reinforce your learning!

Each assignment will have a few of the following categories of exercises:

- ❓ **Questions** – these will be questions that you will be expected to gather the answer to! These can appear as general questions, or questions meant to spark a discussion in your breakout rooms!

- 🏗️ **Activities** – these will be work or coding activities meant to reinforce specific concepts or theory components.

- 🚧 **Advanced Builds (optional)** – Take on a challenge! These builds require you to create something with minimal guidance outside of the documentation. Completing an Advanced Build earns full credit in place of doing the base assignment notebook questions/activities.

### First Assignment

Your first assignment is straightforward and designed to ensure your development environment is ready:

### 1. Set up your development environment

**Required steps:**
- Set up your environment by following the [Environment setup](https://github.com/AI-Maker-Space/Interactive-Dev-Environment-for-AI-Engineers) file
- Clone the AIEO1 repo into your local folder by following the steps in [Setting up local repo](https://github.com/AI-Maker-Space/AIE8/tree/main/00_Setting%20Up%20Git)
- Open Cursor, create your new virtual environment, install necessary packages with `uv sync`

**🚀 Short Git Development Setup (Quick Reference - Used in Our Demo):**

##### Git Workflow with Upstream

Follow this pattern to work with course materials while keeping your own repository organized:

**Initial setup - Create your own repo:**
```bash
# 1. Create a new repository on your GitHub account
# Then clone it locally
git clone git@github.com:yourusername/yourrepo.git
cd yourrepo

# 2. Add the class repository as "upstream" remote
git remote add upstream git@github.com:AI-Maker-Space/AIEO1.git

# 3. Verify both remotes are connected
git remote -v
# You should see both "origin" (your repo) and "upstream" (class repo)

# 4. Pull course materials from upstream
git pull upstream main --allow-unrelated-histories #--no-rebase --no-edit -X ours

# 5. Push to your own repo
git push origin main
```

**Weekly workflow - Work on assignments:**
```bash
# Week 1: Get latest course materials
git checkout main
git pull upstream main  # Pulls any new lessons/materials

# Create YOUR branch for YOUR work
git checkout -b lesson1-assignment

# Make changes, work on homework
# ... do your work ...

# Commit and push to YOUR repo
git add .
git commit -m "Complete lesson 1 assignment"
git push origin lesson1-assignment

# Week 2: New lesson arrives
git checkout main
git pull upstream main  # Get lesson 2 materials
git checkout -b lesson2-assignment
# ... repeat ...
```

**Key points:**
- `main` branch = synced with upstream (course materials)
- Feature branches = YOUR work on YOUR repo
- Upstream updates never overwrite your work
- Push everything to `origin` (your GitHub account)

✅ **You're ready to start coding!**


#### GitFlow Best Practices

Copy the following GitFlow commands into a `.gitflow_rules` file in your Cursor project root. This serves as a quick reference for professional Git workflows:

#### 🏗️ Setup `main` and `develop`

**Clone your repository:**
```bash
# Clone your repository and navigate into it
git clone git@github.com:yourname/yourrepo.git   # Clones the repository using SSH
cd yourrepo                                      # Changes directory to your new repo
```

**Create the `develop` branch:**
```bash
git checkout -b develop
git push -u origin develop
```

#### 📦 Prepare a Release

**Create a release branch from `develop`:**
```bash
git checkout develop
git pull origin develop
git checkout -b release/1.2.0
git push -u origin release/1.2.0
```

**Only bug fixes and version updates:**
```bash
git add .
git commit -m "Fix login validation bug"
git push
```

#### 🚢 Release to Production

**Merge the release branch into `main`:**
```bash
git checkout main
git pull origin main
git merge --no-ff release/1.2.0
git push origin main
```

**Tag the release:**
```bash
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

#### 🔄 Merge Release Back into `develop`

**Keep bug fixes in sync:**
```bash
git checkout develop
git pull origin develop
git merge --no-ff release/1.2.0
git push origin develop
```

**Clean up:**
```bash
git branch -d release/1.2.0
git push origin --delete release/1.2.0
```

> 💡 **Tip:** Create a `.gitflow_rules` file in your project root and paste these commands for quick reference!

### 2. Communicate with OpenAI GPT models through the API via Google Colab Notebooks

- Fill in all the activities and questions in the notebook [`OpenAI_playground_for_developers.ipynb`](./OpenAI_playground_for_developers.ipynb)

### 3. Set up Cursor, our AI-assisted Interactive Development Environment (IDE)

- Work with Jupyter Notebooks locally in IDE according to Git best-practices
- Use AI-assist to help understand each chunk of Python code
- Push your changes to Git following best git practices

### 4. Complete the workflow

- Re-upload modified notebook to Google Colab as a shareable
- **Making your notebook shareable on Google Colab:** After pushing your notebook to GitHub, convert the GitHub link to a Colab shareable link by changing:
  - From: `https://github.com/katerinagawthorpe/myproject/blob/main/demo.ipynb`
  - To: `https://colab.research.google.com/github/katerinagawthorpe/myproject/blob/main/demo.ipynb`
  - Simply replace `https://github.com/` with `https://colab.research.google.com/github/` in your GitHub notebook URL
  - Share the new link - it will open directly in Google Colab and can be run in the browser!

This will help you get comfortable with the tools and workflow we'll be using throughout the course!
