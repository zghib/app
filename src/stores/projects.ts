import { createStore } from 'pinia';
import axios from 'axios';
import { apiRootPath } from '@/api';

const router: any = require('@/router');

type Project = {
	key: string;
	api: {
		version?: string;
		requires2FA: boolean;
		database?: string;
		project_name: string;
		project_logo: {
			full_url: string;
			url: string;
		} | null;
		project_color: string;
		project_foreground: {
			full_url: string;
			url: string;
		} | null;
		project_background: {
			full_url: string;
			url: string;
		} | null;
		telemetry: boolean;
		default_locale: string | null;
		project_public_note: string | null;
	};
	server?: {
		max_upload_size: number;
		general: {
			php_version: string;
			php_api: string;
		};
	};
};

type ProjectsState = {
	projects: Project[];
};

export const useProjectsStore = createStore({
	id: 'projects',

	state: (): ProjectsState => ({
		projects: []
	}),

	getters: {
		currentProject(state): Project | null {
			const currentProjectKey: string | undefined = router.currentRoute.params.project;

			if (currentProjectKey) {
				return (
					state.projects.find((project: Project) => {
						return (project.key = currentProjectKey);
					}) || null
				);
			}

			return null;
		}
	},

	actions: {
		async init() {
			await this.fetchPublicProjects();
		},
		async fetchPublicProjects() {
			const projectsResponse = await axios.get('/server/projects', {
				baseURL: apiRootPath
			});

			const projects: string[] = projectsResponse.data.data;

			const fetchProjectInfo = async (key: string) => {
				const projectResponse = await axios.get(`/${key}/`, { baseURL: apiRootPath });
				this.state.projects = [
					...this.state.projects,
					{
						key,
						...projectResponse.data.data
					}
				];
			};

			await Promise.all(projects.map(fetchProjectInfo));
		}
	}
});
