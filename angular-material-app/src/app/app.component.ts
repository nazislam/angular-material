import { Component, Inject, OnDestroy, OnInit, inject } from "@angular/core";
import { CommonModule, DOCUMENT } from "@angular/common";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { RouterOutlet } from "@angular/router";
import { ThemeService } from "./services/theme.service";
import { Subscription } from "rxjs";
import { BlogInfo } from "./models/blog-info";
import { BlogService } from "./services/blog.service";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [HeaderComponent, FooterComponent, CommonModule, RouterOutlet],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit, OnDestroy {
	title = "angular-material-app";
	blogURL!: string;
	blogInfo!: BlogInfo;
	siteFavicon: any;
	themeService: ThemeService = inject(ThemeService);
	blogService: BlogService = inject(BlogService);
	private querySubscription?: Subscription;

	constructor(@Inject(DOCUMENT) private document: Document) {}

	ngOnInit(): void {
		this.blogURL = this.blogService.getBlogURL();
		this.siteFavicon = this.document.querySelector(
			'link[rel="icon"]'
		) as HTMLLinkElement;
		this.querySubscription = this.blogService
			.getBlogInfo(this.blogURL)
			.subscribe((data) => {
				this.blogInfo = data;
				if (this.blogInfo.isTeam && this.blogInfo.favicon) {
					this.siteFavicon.href = this.blogInfo.favicon;
				} else {
					this.siteFavicon.href = "favicon.ico";
				}
				if (!this.blogInfo.isTeam) {
					this.blogService.getAuthorInfo(this.blogURL).subscribe((data) => {
						if (data.profilePicture) {
							this.siteFavicon.href = data.profilePicture;
						} else {
							this.siteFavicon.href = "favicon.ico";
						}
					});
				}
			});
	}
	ngOnDestroy(): void {
		this.querySubscription?.unsubscribe();
	}
}
