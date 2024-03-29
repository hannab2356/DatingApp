import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from '../../_models/member';
import { Pagination } from '../../_models/pagination';
import { User } from '../../_models/user';
import { UserParams } from '../../_models/userParams';
import { AccountService } from '../../_services/account.service';
import { MemberService } from '../../_services/member.service';

@Component({
	selector: 'app-member-list',
	templateUrl: './member-list.component.html',
	styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
	members: Member[] = [];
	likedMembers: Member[] = [];
	pagination: Pagination | undefined;
	userParams: UserParams | undefined;
	genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];

	constructor(private memberService: MemberService) {
		this.userParams = this.memberService.getUserParams();
	}

	ngOnInit(): void {
		this.loadMembers();
	}

	loadMembers() {
		if (this.userParams) {
			this.memberService.setUserParams(this.userParams);
			this.memberService.getMembers(this.userParams).subscribe({
				next: response => {
					if (response.result && response.pagination) {
						this.members = response.result;
						this.pagination = response.pagination;
					}
				}
			})
		}
	}

	resetFilters() {
		this.userParams = this.memberService.resetUserParams();
		this.loadMembers();
	}

	pageChanged(event: any) {
		if (this.userParams && this.userParams?.pageNumber !== event.page) {
			this.userParams.pageNumber = event.page;
			this.memberService.setUserParams(this.userParams);
			this.loadMembers();
		}
	}
}
